// /pages/api/users/[id].js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query; // Dinamik id'yi query'den al

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: String(id) }, // id burada string olarak alınır
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user); // Kullanıcı bilgilerini döndür
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching user" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: { id: String(id) }, // id burada string olarak alınır
      });
      res.status(204).end(); // Başarılı durum kodu, içerik yok
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting user" });
    }
  } else if (req.method === "PUT") {
    const { firstName, lastName, email, age, password } = req.body;

    try {
      const user = await prisma.user.update({
        where: { id: String(id) }, // id burada string olarak alınır
        data: {
          firstName,
          lastName,
          email,
          age: parseInt(age),
          password,
        },
      });
      res.status(200).json(user); // Güncellenmiş kullanıcıyı döndür
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating user" });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE", "PUT"]); // Desteklenen metodları bildir
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
