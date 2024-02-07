import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: { body: { title: any; author: any; content: any; theme: any; slug: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id?: number; slug?: string; title?: string; author?: string; content?: string; theme?: string; error?: string; }): void; new(): any; }; }; }) {
  // Create a new page
  const { title, author, content, theme, slug} = req.body;
  try {
    const newPage = await prisma.page.create({
      data: {
        title: title,
        author: author,
        content: content,
        theme: theme,
        slug: slug
      }
    });
    res.status(200).json(newPage);
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
/*
export async function GET(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query;
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: parseInt(id as string)
      }
    });
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
    } else {
      res.status(200).json(page);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching page' });
  } 
}
*/
/*

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create a new page
    const { title, author, content, theme } = req.body;
    try {
      const newPage = await prisma.page.create({
        data: {
          title,
          author,
          content,
          theme
        }
      });
      res.status(200).json(newPage);
    } catch (error) {
      res.status(500).json({ error: 'Error creating page' });
    }
  } else if (req.method === 'GET') {
    // Get a page by ID
    const { id } = req.query;
    try {
      const page = await prisma.page.findUnique({
        where: {
          id: parseInt(id as string)
        }
      });
      if (!page) {
        res.status(404).json({ error: 'Page not found' });
      } else {
        res.status(200).json(page);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching page' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
*/