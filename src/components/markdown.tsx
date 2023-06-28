import { component$, useSignal } from '@builder.io/qwik'
import * as showdown from 'showdown'

const converter = new showdown.Converter()


interface MarkdownProps {
  content: string
}

export const Markdown = component$<MarkdownProps>((props) => {
  const content =  useSignal(
   converter.makeHtml(props.content))
  return (
  <div dangerouslySetInnerHTML={content.value}></div>
  )
})