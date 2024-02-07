/*
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, res) {
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
*/