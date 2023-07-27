import { component$, useResource$, Resource } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { notionClientUtils, Page } from '~/data/notion';
import { Markdown } from '../../components/markdown';

export default component$(() => {
  const location = useLocation();
  const page = useResource$<Page>(async ({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());
    return notionClientUtils.getPage(location.params.id);
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
          <img src={data.cover} height={200}/>
          <Markdown content={data.markdown as string} />
        </>
        )}
      ></Resource>
    </>
  );
});