import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { playlistId, videoId } = req.body;

    if (!playlistId || !videoId) {
      return res
        .status(400)
        .json({ error: "Playlist ID and Video ID are required" });
    }

    try {
      const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
        select: { videoIds: true },
      });

      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      const updatedVideoIds = playlist.videoIds.filter(
        (id: string) => id !== videoId
      );

      const updatedPlaylist = await prisma.playlist.update({
        where: { id: playlistId },
        data: {
          videoIds: updatedVideoIds,
        },
      });

      return res.status(200).json(updatedPlaylist);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error removing song from playlist" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
