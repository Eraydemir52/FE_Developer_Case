import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/api/users/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Giriş yapılmadı. Lütfen tekrar giriş yapın.");
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (isEditMode) {
      // Güncelleme işlemi
      try {
        const res = await axios.put(`/api/users/${editUserId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(
          users.map((user) => (user.id === editUserId ? res.data : user))
        );
        setSuccessMessage("Kullanıcı başarıyla güncellendi!");
      } catch (err) {
        console.error(err);
        setError("Kullanıcı güncellenirken hata oluştu.");
      }
    } else {
      // Ekleme işlemi
      try {
        const res = await axios.post("/api/users/users", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers([...users, res.data]);
        setSuccessMessage("Kullanıcı başarıyla eklendi!");
      } catch (err) {
        console.error(err);
        setError("Kullanıcı eklenirken hata oluştu.");
      }
    }

    // Formu temizle ve kapat
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      password: "",
    });
    setIsFormVisible(false);
    setIsEditMode(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      setSuccessMessage("Kullanıcı başarıyla silindi!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Kullanıcı silinirken hata oluştu.");
    }
  };

  const handleEdit = (user) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      password: "", // Şifreyi tekrar girmeniz gerekebilir
    });
    setEditUserId(user.id);
    setIsFormVisible(true);
    setIsEditMode(true);
  };
  // Dashboard.js

  const handleDetails = (id) => {
    router.push(`/dashboard/${id}`); // Kullanıcı detay sayfasına yönlendiriyoruz
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <button
        onClick={() => {
          router.push("/addMany");
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded mx-1"
      >
        Toplu Kullanıcı Ekle
      </button>
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              setIsEditMode(false);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                age: "",
                password: "",
              });
            }}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isFormVisible ? "Formu Kapat" : "Kullanıcı Ekle"}
          </button>

          {isFormVisible && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 bg-white p-4 shadow-md rounded"
            >
              <h3 className="text-lg font-bold mb-4">
                {isEditMode ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Ad"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Soyad"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Yaş"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Şifre"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                {isEditMode ? "Güncelle" : "Kaydet"}
              </button>
            </form>
          )}

          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                <th className="p-2">Ad</th>
                <th className="p-2">Soyad</th>
                <th className="p-2">E-posta</th>
                <th className="p-2">Yaş</th>
                <th className="p-2">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 text-center">{user.firstName}</td>
                  <td className="p-2 text-center">{user.lastName}</td>
                  <td className="p-2 text-center">{user.email}</td>
                  <td className="p-2 text-center">{user.age}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Sil
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Düzenle
                    </button>

                    <button
                      onClick={() => handleDetails(user.id)} // Detay butonuna tıklanınca yönlendirecek
                      className="bg-blue-500 text-white px-2 py-1 rounded mx-2"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
