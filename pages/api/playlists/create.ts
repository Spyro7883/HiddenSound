import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, accountId } = req.body;

    if (!name || !accountId) {
      return res.status(400).json({ error: "Name and accountId are required" });
    }

    try {
      const playlist = await prisma.playlist.create({
        data: {
          name,
          accountId,
          videoIds: [],
        },
      });
      return res.status(200).json(playlist);
    } catch (error) {
      return res.status(500).json({ error: "Error creating playlist" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
