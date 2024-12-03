import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        router.push("/"); // Eğer token yoksa giriş sayfasına yönlendir
      } else {
        setIsAuthenticated(true);
        // Eğer token varsa dashboard'a yönlendir
      }
    };

    // Sayfa yüklendiğinde ilk kontrol
    checkAuthentication();

    // localStorage'da değişiklik olduğunda yeniden kontrol et
    window.addEventListener("storage", checkAuthentication);

    // Temizleme işlemi
    return () => {
      window.removeEventListener("storage", checkAuthentication);
    };
  }, [router]);

  return (
    <>
      {/* Navbar sadece doğrulama yapılmışsa gösterilir */}
      {isAuthenticated && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}
