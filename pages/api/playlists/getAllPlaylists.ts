import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accountId } = req.query;

  if (!accountId || typeof accountId !== "string") {
    return res.status(400).json({ error: "Account ID is required" });
  }

  try {
    const playlists = await prisma.playlist.findMany({
      where: { accountId },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}
