import React, { useEffect, useCallback } from "react"
import hljs from "highlight.js"
import "highlight.js/styles/monokai-sublime.css"
import ReactQuill from "react-quill"
import type { DeltaStatic, Sources } from "quill"
import "react-quill/dist/quill.snow.css"

interface Props {
  placeholder?: string
  content: DeltaStatic | undefined
  setContent: React.Dispatch<React.SetStateAction<DeltaStatic | undefined>>
  setContentForPreview: React.Dispatch<React.SetStateAction<string>>
}

hljs.configure({
  // optionally configure hljs
  languages: ["javascript", "python", "c", "c++", "java", "HTML", "css"],
})

const modules = {
  syntax: {
    highlight: function (text: string) {
      return hljs.highlightAuto(text).value
    },
  },
  toolbar: [
    [{ header: [false, 2, 3, 4, 5, 6] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    ["link", "image"],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    ["clean"],
  ],
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
]

export default function QuillEditor({
  placeholder = "Blog content here...",
  content,
  setContent,
  setContentForPreview,
}: Props) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    const el = document.getElementById("quill")
    if (el) {
      const divs = el.children
      const header = divs[0] as HTMLDivElement
      if (header) {
        header.style.borderTop = "none"
        header.style.borderLeft = "none"
        header.style.borderRight = "none"
        header.style.borderBottom = "1px solid #f5f5f5"
      }
      const content = divs[1] as HTMLDivElement
      if (content) {
        content.style.border = "none"
      }
    }
  }, [])

  const handleChange = useCallback(
    (
      value: string,
      delta: DeltaStatic,
      source: Sources,
      editor: ReactQuill.UnprivilegedEditor
    ) => {
      setTimeout(() => {
        setContent(editor.getContents())
        setContentForPreview(editor.getHTML())
      }, 2000)
    },
    [setContent, setContentForPreview]
  )

  return (
    <ReactQuill
      id="quill"
      theme="snow"
      modules={modules}
      formats={formats}
      value={content}
      onChange={handleChange}
      className="w-full h-full text-lg pb-24"
      placeholder={placeholder}
    />
  )
}
