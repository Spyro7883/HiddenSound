import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // First, try to get the user ID from the OAuth session
      const session = await getSession({ req });

      let userId: string | undefined;

      if (session) {
        userId = session.user?.id; // Assuming the user ID is stored in the session
      } else {
        // If no OAuth session, try to get the user ID from the custom auth cookie
        const cookie = req.headers.cookie
          ?.split("; ")
          .find((row) => row.startsWith("userId="));
        userId = cookie?.split("=")[1];
      }

      if (!userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized: User ID not found" });
      }

      // Optionally, verify that the user exists in the database
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ userId: user.id });
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return res.status(500).json({ error: "Error fetching user ID" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
