// pages/dashboard/[id].js

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserDetails() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = router.query; // URL'den ID'yi alıyoruz

  useEffect(() => {
    if (id) {
      const fetchUserDetails = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await axios.get(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error(err);
          setError("Kullanıcı bilgileri alınırken hata oluştu.");
        }
      };

      fetchUserDetails();
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Kullanıcı Detayları</h2>
      <div className="bg-white p-4 shadow-md rounded">
        <p>
          <strong>Ad:</strong> {user.firstName}
        </p>
        <p>
          <strong>Soyad:</strong> {user.lastName}
        </p>
        <p>
          <strong>E-posta:</strong> {user.email}
        </p>
        <p>
          <strong>Yaş:</strong> {user.age}
        </p>
        <p>
          <strong>Oluşturulma Tarihi:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
