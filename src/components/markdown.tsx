import { component$, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik'

import * as showdown from 'showdown'

const converter = new showdown.Converter()

import hljs from 'highlight.js'
import 'highlight.js/styles/base16/darcula.css';
interface MarkdownProps {
  content: string
}

export const Markdown = component$<MarkdownProps>((props) => {
  const content =  useSignal(
   converter.makeHtml(props.content)
   )
   useVisibleTask$( () => {
      hljs.highlightAll()
   })
  return (
  <div dangerouslySetInnerHTML={content.value}></div>
  )
})