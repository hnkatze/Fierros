'use client'
import NavBar from "@/components/NavBar";
import { Providers } from "@/components/Providers";
import { getIsLoggedInFromLocalStorage } from "@/config/useAuthStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  useEffect(() =>{
    if(!getIsLoggedInFromLocalStorage()){
      router.push('/')
    }
 },[])
  return (
        <Providers>
          <NavBar />
          {children}
        </Providers>
  );
}
