import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}
