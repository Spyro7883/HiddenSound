import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, userId } = req.body;

    console.log("Received request to create playlist with:", { name, userId });

    if (!name || !userId) {
      console.log("Validation failed: Name and userId are required");
      return res.status(400).json({ error: "Name and userId are required" });
    }

    try {
      const playlist = await prisma.playlist.create({
        data: {
          name,
          userId,
          videoIds: [],
        },
      });

      console.log("Playlist created successfully:", playlist);
      return res.status(200).json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      return res.status(500).json({ error: "Error creating playlist" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
