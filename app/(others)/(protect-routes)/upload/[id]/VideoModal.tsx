"use client"

import React, { useCallback, useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MdFileUpload, MdOutlineWarning } from "react-icons/md"
import { HiDotsVertical } from "react-icons/hi"
import { IoCaretDownSharp, IoTrash } from "react-icons/io5"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import _ from "lodash"
import { toast } from "react-toastify"

import ModalWrapper from "@/components/ModalWrapper"
import CloseButton from "@/components/CloseButton"
import ButtonLoader from "@/components/ButtonLoader"
import ProgressBar from "@/components/ProgressBar"
import VideoPlayer from "@/components/VideoPlayer"
import Tag from "../Tag"
import Mask from "@/components/Mask"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
import { contentCategories } from "@/lib/helpers"
import { publishesFolder } from "@/firebase/config"
import { useSubscribeToUpdates } from "@/hooks/useSubscribe"
import { deleteFile, uploadFile } from "@/firebase/helpers"
import { saveVideo } from "@/app/actions/publish-actions"
import type {
  PublishCategory,
  PublishType,
  ThumbnailType,
} from "@/graphql/types"
import type { Publish } from "@/graphql/codegen/graphql"
import type { FileWithPrview } from "@/types"

interface Props {
  publish: Publish
  profileName: string
}

type FormData = {
  title: string
  description: string
  primaryCat: PublishCategory
  secondaryCat: PublishCategory
  visibility: "private" | "public"
  kind: PublishType
}

export default function VideoModal({ publish, profileName }: Props) {
  const publishId = publish?.id
  const [thumbnail, setThumbnail] = useState<FileWithPrview>()
  const [thumbnailError, setThumbnailError] = useState("")
  const [isChangingThumb, setIsChangingThumb] = useState(false)
  const [thumbnailType, setThumbnailType] = useState<ThumbnailType>(() =>
    !publish?.thumbnailType ? "generated" : publish.thumbnailType
  )
  const prevTags = publish?.tags
  const [tags, setTags] = useState<string[]>(
    !prevTags ? [] : prevTags.split(" | ")
  )
  const [isChanged, setIsChanged] = useState<boolean>()
  const [thumbnailLoading, setThumbnailLoading] = useState(false)
  const [thumbnailProgress, setThumbnailProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false)
  const [deleting, setDeleting] = useState(false)

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
    setThumbnailType("custom")
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

  const selectThumbnail = useCallback((s: ThumbnailType) => {
    setThumbnailType(s)
  }, [])

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

  const handleSave = handleSubmit(async (data) => {
    try {
      if (!profileName) return

      setLoading(true)

      // If user upload thumbnail, upload the thumbnail image to cloud storage first
      let thumbnailURI = ""
      let thumbnailRef = ""
      if (thumbnail) {
        setThumbnailLoading(true)
        const { url, fileRef } = await uploadFile({
          file: thumbnail,
          folder: `${publishesFolder}/${profileName}/${publish.id}`,
          setProgress: setThumbnailProgress,
        })
        setThumbnailLoading(false)
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
        thumbnailType: !publish.thumbnailType
          ? "generated"
          : publish.thumbnailType,
        primaryCategory: publish.primaryCategory || "",
        secondaryCategory: publish.secondaryCategory || "",
        visibility: publish.visibility,
        tags: publish.tags || undefined,
      }
      const newData = {
        thumbnail: thumbnailURI,
        thumbnailRef,
        title: data.title || "",
        description: data.description || "",
        thumbnailType: thumbnailType || "",
        primaryCategory: data.primaryCat || "",
        secondaryCategory: data.secondaryCat || "",
        visibility: data.visibility,
        tags: tags.length > 0 ? tags.join(" | ") : undefined,
      }

      const isEqual = _.isEqual(oldData, newData)
      setIsChanged(!isEqual)

      if (isEqual) {
        setLoading(false)
        return
      }

      startTransition(() => saveVideo({ publishId: publish.id, ...newData }))
      const id = setTimeout(() => {
        setLoading(false)
        clearTimeout(id)
      }, 1000)
      toast.success("Video updated", { theme: "dark" })
    } catch (error) {
      setLoading(false)
      setError("Save failed, please try again.")
    }
  })

  const openConfirmDeleteModal = useCallback(() => {
    setConfirmDeleteModalVisible(true)
  }, [])

  const closeConfirmDeleteModal = useCallback(() => {
    setConfirmDeleteModalVisible(false)
  }, [])

  const deleteVideo = useCallback(async () => {
    if (!publishId) return

    try {
      setDeleting(true)
      await fetch(`/api/publish/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishId,
        }),
      })
      router.back()
    } catch (error) {
      setDeleting(false)
    }
  }, [publishId, router])

  if (!publish) return null

  return (
    <ModalWrapper visible>
      <div className="w-full h-full min-w-full min-h-full max-w-full max-h-full flex items-center justify-center">
        <form
          className="relative w-[95%] h-[95%] bg-white rounded-md flex flex-col"
          onSubmit={handleSave}
        >
          {/* This hidden input will send the publish id to the mutation action */}
          <input
            type="text"
            name="id"
            className="hidden"
            value={publish.id}
            onChange={() => {}}
          />

          <div className="w-full h-[70px] px-5 flex items-center justify-between border-b border-gray-100">
            <h6 className="text-xs sm:text-sm md:text-base lg:text-textRegular">
              Id: {publish.id}
            </h6>
            <div className="flex items-center gap-x-10">
              {publish.uploading && (
                <h6 className="text-base">You can savely leave this page.</h6>
              )}
              <CloseButton
                onClick={() => router.back()}
                className="text-base"
              />
            </div>
          </div>

          <div className="flex-grow py-5 px-5 sm:px-10 overflow-y-auto">
            <h6>Details</h6>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
              <div>
                <label
                  htmlFor="title"
                  className="block text-start font-semibold mb-5"
                >
                  Title <span className="text-textDark">*</span>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={publish.title || publish.filename || ""}
                      placeholder="Publish title"
                      className={`block w-full h-12 px-2 font-normal text-base sm:px-4 rounded-sm focus:outline-none focus:border-orangeDark border ${
                        errors.title ? "border-red-500" : "border-gray-200"
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
                  className="block text-start font-semibold mb-5"
                >
                  Description
                  <div className="relative">
                    <textarea
                      defaultValue={publish.description || ""}
                      placeholder="Tell viewers about your content"
                      rows={6}
                      className={`block w-full py-1 px-2 font-normal text-base  sm:px-4 rounded-sm border border-gray-200 focus:outline-none focus:border-orangeDark`}
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
                  className="block text-start font-semibold mb-10"
                >
                  Thumbnail
                  <p className="font-light text-textLight text-sm">
                    Select or upload a picture for the publish thumbnail.
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 sm:gap-x-10">
                    {/* Generated thumbnail */}
                    <div
                      className={`rounded-sm h-[90px] sm:h-[120px] lg:h-[150px] cursor-pointer flex flex-col items-center justify-center  bg-gray-100 border-[2px] ${
                        thumbnailType === "generated" &&
                        publish &&
                        publish.playback
                          ? "border-orangeDark"
                          : "border-transparent"
                      }`}
                      onClick={
                        publish && publish.playback
                          ? selectThumbnail.bind(undefined, "generated")
                          : undefined
                      }
                    >
                      {publish && publish.playback ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={publish.playback.thumbnail}
                          alt="thumbnail_1"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <MdOutlineWarning size={22} />
                          <p className="mt-2 text-center font-light text-xs text-textLight">
                            Generating thumbnail...
                          </p>
                          <ButtonLoader loading color="#f97316" />
                        </>
                      )}
                    </div>

                    {/* Uploaded thumbnail */}
                    <div className="rounded-sm h-[90px] sm:h-[120px] lg:h-[150px] cursor-pointer flex flex-col items-center justify-center">
                      {publish.thumbnail || thumbnail ? (
                        <div
                          className={`relative z-0 w-full h-full flex items-center justify-center border-[2px]  ${
                            thumbnailType === "custom"
                              ? "border-orangeDark"
                              : "border-transparent"
                          }`}
                        >
                          {thumbnail ? (
                            <div
                              className="relative z-10 w-full h-full"
                              onClick={selectThumbnail.bind(
                                undefined,
                                "custom"
                              )}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={thumbnail.preview}
                                alt={thumbnail.name}
                                className="w-full h-full"
                              />
                            </div>
                          ) : publish.thumbnail ? (
                            <div
                              className="relative z-10 w-full h-full"
                              onClick={selectThumbnail.bind(
                                undefined,
                                "custom"
                              )}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={publish.thumbnail}
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
                          {thumbnailLoading && (
                            <div className="absolute z-30 inset-0 bg-white opacity-50">
                              <ProgressBar progress={thumbnailProgress} />
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
                  className="block text-start font-semibold mb-5"
                >
                  Category
                  <p className="font-light text-textLight text-sm">
                    You can choose up to 2 relevant categories.
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-x-2">
                    <div
                      className={`relative py-1 pl-4 rounded-sm border ${
                        errors.primaryCat ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <label htmlFor="primaryCat" className="block font-thin">
                        Primary <span className="text-textDark">*</span>
                      </label>
                      <select
                        className="relative z-10 w-full bg-transparent appearance-none outline-none focus:outline-none cursor-pointer"
                        defaultValue={publish.primaryCategory || undefined}
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
                      className={`relative border border-gray-200 py-1 pl-4 rounded-sm ${
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
                            defaultValue={
                              publish.secondaryCategory || undefined
                            }
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
                  <div className="w-full mb-2 flex items-center justify-center bg-gray-100">
                    {publish.playback ? (
                      <div className="relative w-full h-[180px] min-h-[180px] sm:min-h-[160px] lg:min-h-[260px] bg-black">
                        <VideoPlayer
                          playback={publish.playback}
                          thumbnail={
                            publish.publishType === "Short"
                              ? undefined
                              : publish.thumbnailType === "custom" &&
                                publish.thumbnail
                              ? publish.thumbnail
                              : publish.playback?.thumbnail
                          }
                          playIcon={<></>}
                        />
                      </div>
                    ) : (
                      <div className="h-[180px] sm:h-[160px] lg:h-[260px] flex flex-col items-center justify-center">
                        <p>Uploading...</p>
                        <ButtonLoader loading color="#f97316" />
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border border-gray-200 rounded-sm">
                    {publish.playback && (
                      <div className="mb-4">
                        <p className="font-thin">Playback link</p>
                        <div>
                          <a
                            href={`http://localhost:3000/watch/${publish.id}`}
                            // href={`${BASE_URL}/watch/${publish.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-base text-blueBase break-words"
                          >
                            http://localhost:3000/watch/{publish.id}
                          </a>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-thin">Filename</p>
                      <p>{publish.filename || ""}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <label
                    htmlFor="tags"
                    className="block text-start font-semibold mb-5"
                  >
                    Tags
                    <p className="font-light text-textLight text-sm">
                      Tags can be useful in helping viewers find your video.
                    </p>
                    <div className="w-full p-2 border border-neutral-200 rounded-md overflow-x-auto scrollbar-hide">
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
                  className="block text-start font-semibold mb-5"
                >
                  Visibility
                  <div
                    className={`px-5 mt-2 pt-1  border rounded-sm ${
                      errors.visibility
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  >
                    <label
                      htmlFor="private"
                      className="block font-light text-textLight mb-2"
                    >
                      <input
                        type="radio"
                        value="private"
                        defaultChecked={publish.visibility === "private"}
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
                        defaultChecked={publish.visibility === "public"}
                        className="cursor-pointer mr-4"
                        {...register("visibility", { required: "Required" })}
                      />
                      Public
                    </label>
                  </div>
                  <p className="error">
                    {errors.visibility ? (
                      errors.visibility.message
                    ) : (
                      <>&nbsp;</>
                    )}
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="w-full h-[70px] py-2 px-5 border-t border-neutral-100 flex items-center justify-between">
            <div className="h-full w-[50px] flex items-center">
              {!deleting ? (
                <IoTrash
                  className="text-error text-xl cursor-pointer"
                  onClick={openConfirmDeleteModal}
                />
              ) : (
                <ButtonLoader loading size={5} color="#dc2626" />
              )}
            </div>
            <div className="flex items-center justify-end">
              {typeof isChanged === "boolean" && !isChanged && (
                <p className="error mr-5">No changes</p>
              )}
              {error && <p className="error mr-5">{error}</p>}
              <button type="submit" className="btn-blue mx-0 w-[100px]">
                {loading ? <ButtonLoader loading /> : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirm delete */}
      {confirmDeleteModalVisible && (
        <ConfirmDeleteModal
          loading={deleting}
          onCancel={closeConfirmDeleteModal}
          onConfirm={deleteVideo}
        />
      )}

      {/* Prevent interaction while loading */}
      {(loading || isPending || deleting) && <Mask />}
    </ModalWrapper>
  )
}
