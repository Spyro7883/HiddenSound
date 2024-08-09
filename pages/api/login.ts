import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      // Fetch user by email
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          accounts: true, // Include accounts related to this user
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Check if the user has an account with a password (i.e., non-OAuth user)
      if (user.password) {
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          res.status(401).json({ error: "Invalid password" });
          return;
        }

        res.status(200).json({ message: "Login successful", name: user.name });
      } else {
        // User doesn't have a password set, possibly an OAuth-only user
        res.status(401).json({
          error: "Invalid login method. Please use your OAuth provider.",
        });
      }
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
