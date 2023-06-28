import { component$, useResource$, Resource } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Markdown } from '../../components/markdown';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export interface Page {
  cover?: string
  title: string
  markdown?: string
}

export async function getPage(id: string): Promise<Page> {
  const response: any = await notion.pages.retrieve({ page_id: id });
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdBlocks = await n2m.pageToMarkdown(id);
  const mdString = n2m.toMarkdownString(mdBlocks)
  
  const parsedData = await {
    cover: response?.cover?.external.url,
    title: response?.properties?.Name?.title[0]?.text?.content,
    markdown: mdString.parent
  }

  return parsedData;
}
export default component$(() => {
  const location = useLocation();
  const page = useResource$<Page>(async ({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());
    return getPage(location.params.id);
  })
  return (
    <>
      <a href="/">Home</a>
      <Resource
        value={page}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Failed to load page</div>}
        onResolved={(data) => (
        <>
          <h1>{data.title}</h1>
          <img src={data.cover} />
          <Markdown content={data.markdown as string} />
        </>
        )}
      ></Resource>
    </>
  );
});