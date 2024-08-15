import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { accountId } = req.query;

    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    try {
      const playlists = await prisma.playlist.findMany({
        where: { accountId: accountId as string },
      });

      return res.status(200).json(playlists);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching playlists" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
