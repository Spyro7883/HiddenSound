import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playlistId } = req.query;

  if (!playlistId || typeof playlistId !== "string") {
    return res.status(400).json({ error: "Playlist ID is required" });
  }

  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: {
        videoIds: true, // Only select the video IDs
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    return res.status(200).json(playlist);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching playlist" });
  }
}
