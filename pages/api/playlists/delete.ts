import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Playlist ID is required" });
    }

    try {
      await prisma.playlist.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting playlist" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
