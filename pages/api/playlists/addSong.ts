import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { playlistId, videoId } = req.body;

    if (!playlistId || !videoId) {
      return res
        .status(400)
        .json({ error: "Playlist ID and Video ID are required" });
    }

    try {
      const updatedPlaylist = await prisma.playlist.update({
        where: { id: playlistId },
        data: {
          videoIds: {
            push: videoId,
          },
        },
      });

      return res.status(200).json(updatedPlaylist);
    } catch (error) {
      return res.status(500).json({ error: "Error adding song to playlist" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
