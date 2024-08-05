import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client"; // Ensure the correct import path

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          res.status(409).json({ error: "User already exists" });
          return;
        }

        // Create a new user
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
          },
        });

        res.status(201).json(newUser);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
