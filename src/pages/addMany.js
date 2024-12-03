import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddMany() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Lütfen bir dosya seçin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/users/uploadExcel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage(res.data.message);
      setFile(null);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Bir hata oluştu.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Excel ile Kullanıcı Yükle</h2>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Yükle
        </button>
      </form>
    </div>
  );
}
