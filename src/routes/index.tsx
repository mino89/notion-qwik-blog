import { Resource, component$, useResource$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID as string;
const queryOptions = {
  database_id: databaseId,
}

export async function getDatabase() {
  const response = await notion.databases.query(queryOptions);
  return response.results.map((page: any) => (
    {
      id: page.id,
      title: page.properties.Name.title[0]?.text?.content,
      cover: page.cover?.external.url,
    }
  ));
}


export default component$(() => {
  const database = useResource$<any[]>(async () => {
    return getDatabase();
  });
  return (
    <>
      <h1>Welcome to Qwik</h1>
      <Resource
        value={database}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Failed to load page</div>}
        onResolved={(data) => (
          <> {data.map((page) => (
            <>
              <h1>
              <a href={`/${page.id}`}>{page.title}</a>
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

