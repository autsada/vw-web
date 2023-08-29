import React, { useCallback, useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MdFileUpload } from "react-icons/md"
import { HiDotsVertical } from "react-icons/hi"
import { IoCaretDownSharp } from "react-icons/io5"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import _ from "lodash"
import { toast } from "react-toastify"

import CloseButton from "@/components/CloseButton"
import ButtonLoader from "@/components/ButtonLoader"
import ProgressBar from "@/components/ProgressBar"
import Tag from "@/app/(others)/(protect-routes)/upload/Tag"
import Mask from "@/components/Mask"
import { contentCategories, wait } from "@/lib/helpers"
import { publishesFolder } from "@/firebase/config"
import { useSubscribeToUpdates } from "@/hooks/useSubscribe"
import { deleteFile, uploadFile } from "@/firebase/helpers"
import { saveVideo } from "@/app/actions/publish-actions"
import type { BroadcastType, PublishCategory } from "@/graphql/types"
import type { Publish } from "@/graphql/codegen/graphql"
import type { FileWithPrview } from "@/types"

interface Props {
  modalName?: string
  publish?: Publish
  profileName: string
  closeModal?: () => void
}

type FormData = {
  title: string
  description: string
  primaryCat: PublishCategory
  secondaryCat: PublishCategory
  visibility: "private" | "public"
  broadcastType: BroadcastType
}

export default function StreamModal({
  modalName = "Create stream",
  publish,
  profileName,
  closeModal,
}: Props) {
  const [thumbnail, setThumbnail] = useState<FileWithPrview>()
  const [thumbnailError, setThumbnailError] = useState("")
  const [isChangingThumb, setIsChangingThumb] = useState(false)

  const prevTags = publish?.tags
  const [tags, setTags] = useState<string[]>(
    !prevTags ? [] : prevTags.split(" | ")
  )
  const [isChanged, setIsChanged] = useState<boolean>()
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [thumbnailUploadingProgress, setThumbnailUploadingProgress] =
    useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLDivElement>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const watchPrimary = watch("primaryCat")

  // Subscribe to update on Firestore
  useSubscribeToUpdates(publish?.id)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    const f = acceptedFiles[0] as FileWithPrview

    // Check size
    if (f.size / 1000 > 4096) {
      // Maximum allowed image size = 4mb
      setThumbnailError("File too big")
    }
    const fileWithPreview = Object.assign(f, {
      preview: URL.createObjectURL(f),
    })

    setThumbnail(fileWithPreview)
    setIsChangingThumb(false)
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop: onDrop,
    accept: {
      "image/*": [],
    },
  })

  const requestChangeThumb = useCallback(() => {
    setIsChangingThumb(true)
  }, [])

  const cancelRequestChangeThumb = useCallback(() => {
    setIsChangingThumb(false)
  }, [])

  const onChangeThumb = useCallback(() => {
    if (hiddenInputRef?.current) {
      hiddenInputRef.current.click()
    }
  }, [hiddenInputRef])

  const onClickTagsDiv = useCallback(() => {
    if (tagInputRef.current) {
      const input = document.getElementById("tags-video-input")
      if (input) {
        input.focus()
      }
    }
  }, [])

  const addTag = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const last = value.slice(value.length - 1)
    if (last === ",") {
      // Lowercase before saving a tag
      const newTag = value.substring(0, value.length - 1).toLowerCase()
      if (newTag && !newTag.includes(",")) {
        setTags((prev) =>
          prev.includes(newTag) || prev.length === 4 ? prev : [...prev, newTag]
        )
      }
      e.target.value = ""
    }
  }, [])

  const removeTag = useCallback((t: string) => {
    setTags((prev) => prev.filter((tag) => tag !== t))
  }, [])

  // To start live stream, we first create a publish and then push the user to the `streaming/{id}` page and show them the stream preview modal which they can still edit some information such as `title`, `description` and etc.
  const createLiveStream = handleSubmit(
    async ({
      title,
      description,
      primaryCat,
      secondaryCat,
      visibility,
      broadcastType,
    }) => {
      if (publish || !profileName) return
      if (!title || !primaryCat || !visibility || !broadcastType) return

      try {
        setLoading(true)

        const result = await fetch(`/api/stream/request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            primaryCategory: primaryCat,
            secondaryCategory: secondaryCat,
            visibility,
            tags: tags.length > 0 ? tags.join(" | ") : undefined,
            broadcastType,
          }),
        })
        const data = (await result.json()) as { id: string }
        const publishId = data?.id
        if (!publishId) throw new Error("Request failed")

        // Upload a thumbnail (if any)
        if (thumbnail) {
          setThumbnailUploading(true)
          const { url, fileRef } = await uploadFile({
            file: thumbnail,
            folder: `${publishesFolder}/${profileName}/${publishId}`,
            setProgress: setThumbnailUploadingProgress,
          })
          setThumbnailUploading(false)

          // Save the thumbnail url to the database
          const updateResult = await fetch(`/api/stream/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publishId,
              thumbnail: url,
              thumbnailRef: fileRef,
            }),
          })

          await updateResult.json()
        }

        // Push user to the `streaming/{id}`
        router.push(`/livestreaming/${publishId}`)
      } catch (error) {
        setLoading(false)
      }
    }
  )

  const updateLiveStream = handleSubmit(async (data) => {
    if (!publish || !profileName) return

    try {
      setLoading(true)

      // If user upload thumbnail, upload the thumbnail image to cloud storage first
      let thumbnailURI = ""
      let thumbnailRef = ""
      if (thumbnail) {
        setThumbnailUploading(true)
        const { url, fileRef } = await uploadFile({
          file: thumbnail,
          folder: `${publishesFolder}/${profileName}/${publish.id}`,
          setProgress: setThumbnailUploadingProgress,
        })
        setThumbnailUploading(false)
        thumbnailURI = url
        thumbnailRef = fileRef

        if (publish.thumbnailRef) {
          // Delete the old thumbnail from cloud storage (without waiting)
          deleteFile(publish.thumbnailRef)
        }
      } else {
        thumbnailURI = publish.thumbnail || ""
        thumbnailRef = publish.thumbnailRef || ""
      }

      const oldData = {
        thumbnail: publish.thumbnail || "",
        thumbnailRef: publish.thumbnailRef || "",
        title: publish.title,
        description: publish.description || "",
        primaryCategory: publish.primaryCategory || "",
        secondaryCategory: publish.secondaryCategory || "",
        visibility: publish.visibility,
        tags: publish.tags || undefined,
        broadcastType: publish.broadcastType,
      }
      const newData = {
        thumbnail: thumbnailURI,
        thumbnailRef,
        title: data.title || "",
        description: data.description || "",
        primaryCategory: data.primaryCat || "",
        secondaryCategory: data.secondaryCat || "",
        visibility: data.visibility,
        tags: tags.length > 0 ? tags.join(" | ") : undefined,
        broadcastType: data.broadcastType,
      }

      const isEqual = _.isEqual(oldData, newData)
      setIsChanged(!isEqual)

      if (isEqual) {
        setLoading(false)
        return
      }

      startTransition(() =>
        saveVideo({
          publishId: publish.id,
          thumbnailType: "custom",
          ...newData,
        })
      )

      // Wait 5 seconds to make sure the update is done.
      await wait(5000)
      // Reload the page
      router.refresh()
      setLoading(false)
      toast.success("Stream updated", { theme: "dark" })

      // Close modal to show preview stream
      if (closeModal) {
        closeModal()
      }
    } catch (error) {
      setLoading(false)
      setError("Save failed, please try again.")
    }
  })

  return (
    <div className="absolute z-10 inset-0 flex items-center justify-center">
      <div className="absolute inset-0 z-10 bg-black opacity-60"></div>
      <form
        className="relative z-20 w-[90%] h-[90%] bg-white rounded-md flex flex-col"
        onSubmit={!publish ? createLiveStream : updateLiveStream}
      >
        {/* This hidden input will send the publish id to the mutation action */}
        {!!publish && (
          <input
            type="text"
            name="id"
            className="hidden"
            value={publish.id}
            onChange={() => {}}
          />
        )}

        <div className="w-full h-[80px] px-5 flex items-center justify-between border-b border-neutral-100">
          <h6>{modalName}</h6>
          <div className="h-full flex-grow flex justify-end items-center gap-x-5">
            {loading && <p className="text-blueBase">Processing...</p>}
            {publish && closeModal && (
              <div>
                <CloseButton onClick={closeModal} className="text-base" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow py-5 px-5 sm:px-10 overflow-y-auto">
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
            <div>
              <label
                htmlFor="title"
                className="block text-start font-semibold text-textRegular mb-5"
              >
                Title <span className="text-textDark">*</span>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue={publish?.title || publish?.filename || ""}
                    placeholder="Publish title"
                    className={`block w-full h-12 px-2 font-normal text-base sm:px-4 rounded-sm focus:outline-none focus:border-orangeDark border ${
                      errors.title ? "border-red-500" : "border-neutral-200"
                    }`}
                    {...register("title", {
                      required: "Required",
                      minLength: {
                        value: 3,
                        message: "Too short (min 3 characters)",
                      },
                      maxLength: {
                        value: 64,
                        message: "Too long (max 64 characters)",
                      },
                    })}
                  />
                  <p className="error">
                    {errors.title ? errors.title.message : <>&nbsp;</>}
                  </p>
                </div>
              </label>

              <label
                htmlFor="description"
                className="block text-start font-semibold text-textRegular mb-5"
              >
                Description
                <div className="relative">
                  <textarea
                    defaultValue={publish?.description || ""}
                    placeholder="Tell viewers about your content"
                    rows={6}
                    className={`block w-full py-1 px-2 font-normal text-base  sm:px-4 rounded-sm border border-neutral-200 focus:outline-none focus:border-orangeDark`}
                    {...register("description", {
                      maxLength: {
                        value: 5000,
                        message: "Too long",
                      },
                    })}
                  />
                </div>
                <p className="error">
                  {errors.description ? (
                    errors.description.message
                  ) : (
                    <>&nbsp;</>
                  )}
                </p>
              </label>

              <label
                htmlFor="thumbnail"
                className="block text-start font-semibold text-textRegular mb-10"
              >
                Thumbnail
                <p className="font-light text-textLight text-sm">
                  Upload a picture for the publish thumbnail.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 sm:gap-x-10">
                  <div className="rounded-sm h-[90px] sm:h-[120px] lg:h-[150px] cursor-pointer flex flex-col items-center justify-center">
                    {publish?.thumbnail || thumbnail ? (
                      <div className="relative z-0 w-full h-full flex items-center justify-center">
                        {thumbnail ? (
                          <div className="relative z-10 w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumbnail.preview}
                              alt={thumbnail.name}
                              className="w-full h-full"
                            />
                          </div>
                        ) : publish?.thumbnail ? (
                          <div className="relative z-10 w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={publish?.thumbnail}
                              alt="thumbnail"
                              className="w-full h-full"
                            />
                          </div>
                        ) : null}

                        {/* This will allow user to request to change the uploaded thumbnail */}
                        <div className="absolute z-20 top-0 right-0 cursor-pointer py-1 w-[30px]">
                          <div className="absolute z-10 inset-0 bg-gray-500 opacity-40 rounded-[4px]" />
                          {!isChangingThumb ? (
                            <div
                              className="relative z-20 w-full h-full text-white flex items-center justify-center"
                              onClick={requestChangeThumb}
                            >
                              <HiDotsVertical
                                size={22}
                                className="relative z-20"
                                color="white"
                              />
                            </div>
                          ) : (
                            <div
                              className="relative z-20 w-full h-full text-white flex items-center justify-center"
                              onClick={cancelRequestChangeThumb}
                            >
                              &#10005;
                            </div>
                          )}
                        </div>

                        {/* A button to be clicked to open upload box */}
                        {isChangingThumb && (
                          <button
                            type="button" // Makue sure to set type to "button"
                            className="absolute z-20 btn-orange px-5 rounded-full"
                            onClick={onChangeThumb}
                          >
                            Change
                          </button>
                        )}

                        {/* Hidden input to be clicked to change thumbnail */}
                        <div
                          className="hidden"
                          {...getRootProps({
                            isDragActive,
                            isDragReject,
                            isDragAccept,
                          })}
                        >
                          <input {...getInputProps()} ref={hiddenInputRef} />
                        </div>

                        {/* Progress bar when uploading thumbnail */}
                        {thumbnailUploading && (
                          <div className="absolute z-30 inset-0 bg-white opacity-50">
                            <ProgressBar
                              progress={thumbnailUploadingProgress}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="relative w-full h-full flex flex-col items-center justify-center bg-gray-100"
                        {...getRootProps({
                          isDragActive,
                          isDragReject,
                          isDragAccept,
                        })}
                      >
                        <input {...getInputProps()} />
                        <MdFileUpload size={25} />
                        <p className="font-light text-textLight text-sm mt-2">
                          Upload thumbnail
                        </p>
                        <span className="block font-light text-textExtraLight text-xs">
                          (Max 4MB)
                        </span>

                        {thumbnailError && (
                          <p className="absolute bottom-0 error">
                            {thumbnailError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </label>

              <label
                htmlFor="category"
                className="block text-start font-semibold text-textRegular mb-5"
              >
                Category
                <p className="font-light text-textLight text-sm">
                  You can choose up to 2 relevant categories.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-2">
                  <div
                    className={`relative py-1 pl-4 rounded-sm border ${
                      errors.primaryCat
                        ? "border-red-500"
                        : "border-neutral-200"
                    }`}
                  >
                    <label
                      htmlFor="primaryCat"
                      className="block font-thin text-textRegular"
                    >
                      Primary <span className="text-textDark">*</span>
                    </label>
                    <select
                      className="relative z-10 w-full bg-transparent appearance-none outline-none focus:outline-none cursor-pointer"
                      defaultValue={publish?.primaryCategory || undefined}
                      {...register("primaryCat", {
                        required: "Required",
                      })}
                    >
                      <option value="">----</option>
                      {contentCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute z-0 top-0 right-2 h-full flex flex-col justify-center">
                      <IoCaretDownSharp />
                    </div>
                  </div>
                  <div
                    className={`relative border border-neutral-200 py-1 pl-4 rounded-sm ${
                      !watchPrimary ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {watchPrimary && (
                      <>
                        <label
                          htmlFor="secondaryCat"
                          className="block font-thin"
                        >
                          Secondary
                        </label>
                        <select
                          id="secondary"
                          className="relative z-10 w-full bg-transparent appearance-none outline-none focus:outline-none cursor-pointer"
                          defaultValue={publish?.secondaryCategory || undefined}
                          disabled={!watchPrimary}
                          {...register("secondaryCat")}
                        >
                          <option value="">----</option>
                          {contentCategories
                            .filter((cat) => cat !== watchPrimary)
                            .map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                        <div className="absolute z-0 top-0 right-2 h-full flex flex-col justify-center">
                          <IoCaretDownSharp />
                        </div>
                      </>
                    )}
                  </div>

                  <p className="error">
                    {errors.primaryCat ? (
                      errors.primaryCat.message
                    ) : (
                      <>&nbsp;</>
                    )}
                  </p>
                </div>
              </label>
            </div>

            <div className="sm:px-5">
              <div className="mb-10">
                <label
                  htmlFor="tags"
                  className="block text-start font-semibold text-textRegular mb-5"
                >
                  Tags
                  <p className="font-light text-textLight text-sm">
                    Tags can be useful in helping viewers find your video.
                  </p>
                  <div className="w-full p-2 border border-neutral-200 rounded-sm overflow-x-auto scrollbar-hide">
                    <div
                      ref={tagInputRef}
                      className="w-max h-full flex items-center gap-2 cursor-pointer"
                      onClick={onClickTagsDiv}
                    >
                      {tags.length > 0 &&
                        tags.map((tag) => (
                          <Tag key={tag} tag={tag} onClick={removeTag} />
                        ))}
                      {tags.length < 4 && (
                        <input
                          id="tags-video-input"
                          type="text"
                          name="tag"
                          maxLength={31}
                          placeholder="Add up to 4 tags"
                          className="block h-full"
                          onChange={addTag}
                        />
                      )}
                    </div>
                  </div>
                  <p className="font-light text-textLight text-sm">
                    Enter a comma after each tag
                  </p>
                </label>
              </div>

              <label
                htmlFor="visibility"
                className="block text-start font-semibold text-textRegular mb-5"
              >
                Visibility
                <div
                  className={`px-5 mt-2 pt-1  border rounded-sm ${
                    errors.visibility ? "border-red-500" : "border-transparent"
                  }`}
                >
                  <label
                    htmlFor="private"
                    className="block font-light text-textLight mb-2"
                  >
                    <input
                      type="radio"
                      value="private"
                      defaultChecked={publish?.visibility === "private"}
                      className="cursor-pointer mr-4"
                      {...register("visibility", { required: "Required" })}
                    />
                    Private
                  </label>
                  <label
                    htmlFor="public"
                    className="block font-light text-textLight"
                  >
                    <input
                      type="radio"
                      value="public"
                      defaultChecked={publish?.visibility === "public"}
                      className="cursor-pointer mr-4"
                      {...register("visibility", { required: "Required" })}
                    />
                    Public
                  </label>
                </div>
                <p className="error">
                  {errors.visibility ? errors.visibility.message : <>&nbsp;</>}
                </p>
              </label>

              <label
                htmlFor="broadcastType"
                className="block text-start font-semibold text-textRegular mb-5"
              >
                Broadcast type
                <p className="font-light text-textLight text-sm">
                  Choose your streaming source - webcam or external software.
                </p>
                <div
                  className={`relative px-5 mt-2 pt-1  border rounded-sm ${
                    errors.broadcastType
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                >
                  <label
                    htmlFor="webcam"
                    className="block font-light text-textLight mb-2"
                  >
                    <input
                      type="radio"
                      value="webcam"
                      defaultChecked={publish?.broadcastType === "webcam"}
                      className="cursor-pointer mr-4"
                      {...register("broadcastType", { required: "Required" })}
                    />
                    Webcam
                  </label>
                  <label
                    htmlFor="software"
                    className="block font-light text-textLight"
                  >
                    <input
                      type="radio"
                      value="software"
                      defaultChecked={publish?.broadcastType === "software"}
                      className="cursor-pointer mr-4"
                      {...register("broadcastType", { required: "Required" })}
                    />
                    External software (for example: OBS Studio, Streamlabs)
                  </label>

                  {/* Disable changing broadcast type */}
                  {publish && (
                    <div className="absolute inset-0 bg-white opacity-50"></div>
                  )}
                </div>
                <p className="error">
                  {errors.broadcastType ? (
                    errors.broadcastType.message
                  ) : (
                    <>&nbsp;</>
                  )}
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className="w-full h-[70px] py-2 px-5 border-t border-neutral-100 flex items-center justify-end">
          <div className="flex items-center justify-end">
            {typeof isChanged === "boolean" && !isChanged && (
              <p className="error mr-5">No changes</p>
            )}
            {error && <p className="error mr-5">{error}</p>}
            <button type="submit" className="btn-blue mx-0 w-[100px]">
              {loading ? <ButtonLoader loading /> : publish ? "SAVE" : "NEXT"}
            </button>
          </div>
        </div>
      </form>

      {/* Prevent interaction while loading */}
      {(loading || isPending) && <Mask />}
    </div>
  )
}
