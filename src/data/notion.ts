import { Client } from '@notionhq/client';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID as string;



export interface Page {
  id?: string
  cover?: string
  slug? : string
  title: string
  markdown?: string
}


export const notionClientUtils = {
  
  getDatabase: async (): Promise<Page[]> => {
    const queryOptions: QueryDatabaseParameters = {
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ],
      filter:{
        property: 'Status',
        status:{
          equals: 'published'
        }

      }
    }
    const response = await notion.databases.query(queryOptions );
    const responseData = response.results.map((page: any) => (
      {
        id: page.id,
        title: page.properties.Name.title[0]?.text?.content,
        slug: page.properties.slug.rich_text[0]?.text?.content,
        cover: page.cover?.external.url,
      }
    ));
    return responseData;
  },

  getPage: async (id: string): Promise<Page> => {
    const queryOptions: QueryDatabaseParameters = {
      database_id: databaseId,
      filter:{
        property: 'slug',
        rich_text:{
          equals: id
        }

      }
    }
    const response: any = await notion.databases.query(queryOptions );
    const n2m = new NotionToMarkdown({ notionClient: notion });

    const mdBlocks = await n2m.pageToMarkdown(response.results[0].id);
    const mdString = n2m.toMarkdownString(mdBlocks)
    
    const parsedData = {
      cover: response[0]?.cover?.external.url,
      title: response[0]?.properties?.Name?.title[0]?.text?.content,
      markdown: mdString.parent
    }
  
    return parsedData;
  }

  
}