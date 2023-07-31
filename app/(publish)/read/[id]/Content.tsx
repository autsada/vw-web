"use client"

import React from "react"
import parse from "html-react-parser"
import hljs from "highlight.js"
import "highlight.js/styles/monokai-sublime.css"

interface Props {
  content: any
}

hljs.configure({
  // optionally configure hljs
  languages: ["javascript", "python", "c", "c++", "java", "HTML", "css"],
})

export default function Content({ content }: Props) {
  if (!content) return null

  return (
    <article className="mt-10 pb-10 prose md:prose-lg lg:prose-xl prose-a:text-blue-500 prose-blockquote:font-light prose-blockquote:italic prose-p:text-base md:prose-p:text-lg xl:prose-p:text-xl">
      {parse(content)}
    </article>
  )
}
