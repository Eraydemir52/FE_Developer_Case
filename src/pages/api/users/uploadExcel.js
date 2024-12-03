import ExcelJS from "exceljs";
import * as z from "zod";
import prisma from "../../../lib/prisma";
import multer from "multer";

const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  age: z.number().min(1).max(120),
  password: z.string().min(6),
});

// Multer ile dosya yüklemeyi destekle
const upload = multer();

export const config = {
  api: {
    bodyParser: false, // Multer kullanılacağı için bodyParser devre dışı
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Dosya yüklenirken hata oluştu." });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "Dosya eksik." });
      }

      try {
        // ExcelJS ile dosyayı işleme
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.getWorksheet(1);
        const users = [];

        // Excel'deki her satırı işle
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Başlık satırını atla
          const user = {
            firstName: row.getCell(1).value,
            lastName: row.getCell(2).value,
            email: row.getCell(3).value,
            age: parseInt(row.getCell(4).value, 10),
            password: row.getCell(5).value,
          };

          // Kullanıcı verilerini doğrula
          UserSchema.parse(user);
          users.push(user);
        });

        // Prisma ile veritabanına ekle
        await prisma.user.createMany({ data: users });

        res.status(201).json({ message: "Kullanıcılar başarıyla eklendi." });
      } catch (error) {
        console.error(error);
        res.status(400).json({
          error: "Hata oluştu. Lütfen dosyanızın formatını kontrol edin.",
          details: error.message,
        });
      }
    });
  } else {
    res.status(405).json({ error: "Sadece POST istekleri desteklenir." });
  }
}
