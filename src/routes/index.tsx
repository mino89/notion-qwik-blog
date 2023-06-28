import { Resource, component$, useResource$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { Page, notionClientUtils } from '~/data/notion';

export default component$(() => {
  const database = useResource$<Page[]>(async () => {
    return notionClientUtils.getDatabase();
  });
  return (
    <>
      <Resource
        value={database}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Failed to load page</div>}
        onResolved={(data) => (
          <> {data.map((page) => (
            <>
              <h1>
              <a href={`/${page.slug}`}>{page.title}</a>
                </h1>
            </>
          ))
          }
          </>
        )}
      />

    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};

