import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, age, password } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          age: parseInt(age), // Yaş integer olmalı
          password,
        },
      });
      res.status(201).json(user); // Başarılı durum kodu ve kullanıcı verisi
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error creating user" });
    }
  } else if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching users" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]); // Desteklenen metodları bildir
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
