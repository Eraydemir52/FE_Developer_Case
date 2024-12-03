import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // Çıkış işlemi: token'ı localStorage'dan sil
    localStorage.removeItem("token");
    // Kullanıcıyı login sayfasına yönlendir
    router.push("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          <h1 className="text-2xl font-bold cursor-pointer">Logo</h1>
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
}
