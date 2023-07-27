import React, {
  useState,
  useCallback,
  useRef,
  useTransition,
  ChangeEvent,
} from "react"
import Dropzone from "react-dropzone"
import { IoCaretDownSharp } from "react-icons/io5"
import { useRouter } from "next/navigation"
import type { DeltaStatic } from "quill"

import CloseButton from "@/components/CloseButton"
import ModalWrapper from "@/components/ModalWrapper"
import ButtonLoader from "@/components/ButtonLoader"
import Mask from "@/components/Mask"
import PreviewMode from "./PreviewMode"
import Tag from "./Tag"
import QuillEditor from "./QuillEditor"
import ConfirmModal from "@/components/ConfirmModal"
import { uploadFile } from "@/firebase/helpers"
import { publishesFolder } from "@/firebase/config"
import { saveBlogPost } from "@/app/actions/publish-actions"
import { contentCategories } from "@/lib/helpers"
import type { FileWithPrview } from "@/types"
import type { Profile } from "@/graphql/codegen/graphql"
import type { PublishCategory, PublishVisibility } from "@/graphql/types"

interface Props {
  profile: Profile
  cancelUpload: () => void
  profileName: string
}

export default function CreateBlogModal({
  profile,
  cancelUpload,
  profileName,
}: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [title, setTitle] = useState("")
  const [titleError, setTitleError] = useState("")
  const [image, setImage] = useState<FileWithPrview>()
  const [fileError, setFileError] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [primaryCat, setPrimaryCat] = useState<PublishCategory>()
  const [primaryCatError, setPrimaryCatError] = useState("")
  const [secondaryCat, setSecondaryCat] = useState<PublishCategory>()
  const [content, setContent] = useState<DeltaStatic>()
  const [contentForPreview, setContentForPreview] = useState("")
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [publishingBlog, setPublishingBlog] = useState(false)
  const [error, setError] = useState("")

  const tagInputRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onCloseModal = useCallback(() => {
    if (
      !title &&
      !image &&
      tags.length === 0 &&
      !content &&
      !contentForPreview
    ) {
      cancelUpload()
    } else {
      setConfirmModalVisible(true)
    }
  }, [title, image, tags, content, contentForPreview, cancelUpload])

  const closeConfirmModal = useCallback(() => {
    setConfirmModalVisible(false)
  }, [])

  const createPublish = useCallback(async () => {
    const result = await fetch(`/api/publish/draftBlog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await result.json()
    const publishId = data?.id as string
    return publishId
  }, [])

  const saveBlog = useCallback(
    async (visibility: PublishVisibility) => {
      if (
        !profileName ||
        (!title && !image && !primaryCat && !content && !contentForPreview)
      )
        return

      try {
        if (visibility === "draft") {
          // Validate title
          if (title.length > 128) {
            setTitleError("Max title length 128 characters.")
            return
          } else {
            setTitleError("")
          }
          setSavingDraft(true)
        } else if (visibility === "public") {
          // Validate title
          if (title.length === 0) {
            setTitleError("Title is required.")
            return
          } else if (title.length < 3) {
            setTitleError("Min title length 3 characters.")
            return
          } else if (title.length > 128) {
            setTitleError("Max title length 128 characters.")
            return
          } else {
            setTitleError("")
          }

          // Validate primary category
          if (!primaryCat) {
            setPrimaryCatError("Primary category is required.")
            return
          }

          // Validate content
          if (!content || !contentForPreview) {
            setError("No content to publish.")
            return
          }
          setPublishingBlog(true)
        }

        // 1. Create a publish
        const publishId = await createPublish()

        // 2. Save a blog
        // 2.1 Upload image to cloud storage (if any)
        let imageUrl: string | undefined = undefined
        let imageRef: string | undefined = undefined
        let filename: string | undefined = undefined
        if (image) {
          const { url, fileRef } = await uploadFile({
            file: image,
            folder: `${publishesFolder}/${profileName}/${publishId}`,
          })
          imageUrl = url
          imageRef = fileRef
          filename = image.name
        }

        // 2.2 Save the draft
        startTransition(() =>
          saveBlogPost({
            publishId,
            title,
            imageUrl,
            imageRef,
            filename,
            primaryCategory: primaryCat,
            secondaryCategory: secondaryCat,
            tags: tags.length > 0 ? tags.join(" ") : undefined,
            content: content ? JSON.stringify(content) : undefined,
            htmlContent: contentForPreview,
            visibility,
            preview: visibility === "public" ? contentForPreview : undefined,
          })
        )

        // Push user to upload --> blogs
        router.push("/upload/publishes/blogs")
      } catch (error) {
        if (visibility === "draft") {
          setSavingDraft(false)
        } else if (visibility === "public") {
          setPublishingBlog(false)
        }
        setError("Failed saving the draft, please try again.")
      }
    },
    [
      profileName,
      title,
      image,
      tags,
      primaryCat,
      secondaryCat,
      content,
      contentForPreview,
      createPublish,
      router,
    ]
  )

  const changeMode = useCallback((m: "edit" | "preview") => {
    setMode(m)
  }, [])

  const changeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setTitle(value)
      if (titleError && value.length >= 3 && value.length <= 128)
        setTitleError("")
    },
    [titleError]
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    const f = acceptedFiles[0] as FileWithPrview

    // Check size
    if (f.size / 1000 > 4096) {
      // Maximum allowed image size = 4mb
      setFileError("File too big")
    }
    const fileWithPreview = Object.assign(f, {
      preview: URL.createObjectURL(f),
    })

    setImage(fileWithPreview)
  }, [])

  const removeImage = useCallback(() => {
    setImage(undefined)
  }, [])

  const onClickTagsDiv = useCallback(() => {
    if (tagInputRef.current) {
      const input = document.getElementById("tag-input")
      if (input) {
        input.focus()
      }
    }
  }, [])

  const addTag = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const last = value.slice(value.length - 1)
    if (last === ",") {
      // Remove space and lowercase before saving a tag
      const newTag = value
        .substring(0, value.length - 1)
        .split(" ")
        .join("")
        .toLowerCase()
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

  const onChangePrimaryCat = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setPrimaryCat(e.target.value as PublishCategory)
      if (primaryCatError) setPrimaryCatError("")
    },
    [primaryCatError]
  )

  const onChangeSecondaryCat = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSecondaryCat(e.target.value as PublishCategory)
    },
    []
  )

  return (
    <ModalWrapper visible>
      <div className="w-full h-full min-w-full min-h-full max-w-full max-h-full flex items-center justify-center">
        <div className="relative w-[95%] h-[95%] bg-white rounded-md overflow-hidden flex flex-col">
          <div className="w-full py-2 px-5 8-red-200 flex items-center justify-between border-b border-neutral-100">
            <h6>Create blog</h6>
            <div className="h-full flex items-center justify-between">
              <div className="h-full flex items-center justify-center mr-2 sm:mr-10 md:mr-14 lg:mr-18 xl:mr-24">
                <button
                  onClick={changeMode.bind(undefined, "edit")}
                  className={`w-[50px] ${
                    mode === "edit" ? "font-semibold" : "font-light"
                  } sm:mr-5`}
                >
                  Edit
                </button>
                <button
                  onClick={changeMode.bind(undefined, "preview")}
                  className={`w-[80px] ${
                    mode === "preview" ? "font-semibold" : "font-light"
                  }`}
                >
                  Preview
                </button>
              </div>
              <CloseButton onClick={onCloseModal} className="text-base" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto lg:overflow-y-hidden scrollbar-hide">
            {/* Edit */}
            <div className={`${mode === "edit" ? "block" : "hidden"} h-full`}>
              <div className="w-full pt-1 overflow-x-auto">
                <input
                  type="text"
                  placeholder="Blog title here"
                  className={`w-max min-w-full px-2 sm:px-4 py-1 text-semibold text-2xl md:text-3xl lg:text-4xl border-b-[2px] break-words break-all ${
                    titleError ? "border-error" : "border-white"
                  }`}
                  minLength={3}
                  maxLength={128}
                  value={title}
                  onChange={changeTitle}
                />
              </div>

              <div className="w-full h-full px-2 sm:px-4 sm:divide-neutral-100 flex flex-col lg:flex-row pb-[100px]">
                <div className="w-full h-max lg:h-full lg:w-2/5 py-2 px-2 lg:overflow-y-auto scrollbar-hide">
                  <div className="mb-4 w-full">
                    <div className="relative z-0 w-full flex items-center justify-center">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-full h-[200px] md:h-[320px] lg:h-[220px] xl:h-[250px]  object-cover"
                        />
                      )}
                    </div>
                    <div className="pt-5 flex items-center justify-center gap-x-8">
                      <Dropzone
                        accept={{
                          "image/*": [],
                        }}
                        onDrop={onDrop}
                        multiple={false}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <button
                              type="button"
                              className="btn-light mx-0 px-6 rounded-full"
                            >
                              {image ? "Change" : "Add a cover image"}
                            </button>
                          </div>
                        )}
                      </Dropzone>
                      {image && (
                        <button
                          type="button"
                          className="btn-cancel mx-0 px-6 rounded-full"
                          onClick={removeImage}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <label
                    htmlFor="tags"
                    className="block text-start font-semibold mb-5"
                  >
                    Tags
                    <p className="font-light text-textLight text-sm">
                      Tags can be useful in helping readers find your blog.
                    </p>
                    <div className="w-full p-2 border border-neutral-200 rounded-md overflow-x-auto scrollbar-hide">
                      <div
                        ref={tagInputRef}
                        className="w-max h-[30px] flex items-center gap-2 cursor-pointer"
                        onClick={onClickTagsDiv}
                      >
                        {tags.length > 0 &&
                          tags.map((tag) => (
                            <Tag key={tag} tag={tag} onClick={removeTag} />
                          ))}
                        {tags.length < 4 && (
                          <input
                            id="tag-input"
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

                  <div className="mt-5">
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
                            primaryCatError
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                        >
                          <label
                            htmlFor="primaryCat"
                            className="block font-thin"
                          >
                            Primary <span className="text-textDark">*</span>
                          </label>
                          <select
                            className="relative z-10 w-full bg-transparent appearance-none outline-none focus:outline-none cursor-pointer"
                            onChange={onChangePrimaryCat}
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
                            !primaryCat ? "opacity-50" : "opacity-100"
                          }`}
                        >
                          {primaryCat && (
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
                                disabled={!primaryCat}
                                onChange={onChangeSecondaryCat}
                              >
                                <option value="">----</option>
                                {contentCategories
                                  .filter((cat) => cat !== primaryCat)
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
                      </div>
                    </label>
                  </div>
                </div>

                <div className="w-full h-full lg:w-3/5 sm:px-2 lg:px-3 xl:px-4 pb-[100px]">
                  <QuillEditor
                    content={content}
                    setContent={setContent}
                    setContentForPreview={setContentForPreview}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div
              className={`${
                mode === "preview" ? "block" : "hidden"
              } h-full overflow-y-auto`}
            >
              <PreviewMode
                profile={profile}
                title={title}
                hashTags={tags}
                imageUrl={image?.preview}
                imageName={image?.name}
                content={contentForPreview}
              />
            </div>
          </div>

          <div className="w-full h-[70px] py-2 px-5 border-t border-neutral-100 flex items-center justify-end gap-x-5">
            <p className="error">
              {titleError ? (
                titleError
              ) : fileError ? (
                fileError
              ) : primaryCatError ? (
                primaryCatError
              ) : error ? (
                error
              ) : (
                <>&nbsp;</>
              )}
            </p>
            <button
              type="button"
              className="btn-light mx-0 w-[100px]"
              onClick={saveBlog.bind(undefined, "draft")}
            >
              {savingDraft ? <ButtonLoader loading /> : "Save draft"}
            </button>
            <button
              type="button"
              className="btn-blue mx-0 w-[100px]"
              onClick={saveBlog.bind(undefined, "public")}
            >
              {publishingBlog ? <ButtonLoader loading /> : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModalVisible && (
        <ConfirmModal
          cancelText="Yes, leave"
          onCancel={cancelUpload}
          confirmText="No, stay"
          onConfirm={closeConfirmModal}
        >
          <div>
            <h6 className="text-lg md:text-xl">
              This will NOT save the draft, do you really want to leave?
            </h6>
          </div>
        </ConfirmModal>
      )}

      {/* Prevent interaction while creating a draft */}
      {(savingDraft || publishingBlog || isPending) && <Mask />}
    </ModalWrapper>
  )
}
