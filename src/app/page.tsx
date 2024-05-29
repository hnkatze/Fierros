"use client";
import { checkUserExists } from "@/config/crude";
import { clearLocalStorage, setIsLoggedInLocalStorage } from "@/config/useAuthStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await checkUserExists(userName, password).then((exist) => {
      if (!exist) {
        Swal.fire({
          title: "Opps!",
          text: `Usuario o Contraseña Incorrecta`,
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Vamos Alla!",
          text: `Se Encontro El Usuario`,
          icon: "success",
        });
        router.push("/dash");
        setIsLoggedInLocalStorage(true);
      }
    });
  };

  useEffect(() => {
     const clear = () =>{
      setIsLoggedInLocalStorage(false);
     }
     clear();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-white w-4/12 h-auto p-6 rounded-lg shadow-lg">
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl uppercase font-mono text-center mb-4 text-blue-600">
            Inicio de Sesión
          </h2>
          <span className="text-xl uppercase font-mono text-center block mb-6 text-gray-600">
            Ingresa usuario y contraseña para continuar
          </span>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Usuario
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Usuario"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
