import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const userId = req.query.userId;

    try {
      const account = await prisma.account.findFirst({
        where: {
          userId: userId as string,
        },
      });

      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      return res.status(200).json({ accountId: account.id });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching account" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
