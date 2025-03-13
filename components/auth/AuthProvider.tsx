"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/cart";
import { doc, getDoc } from "firebase/firestore";

export type nUser = User & { cart: CartItem[] };
interface AuthContextType {
  user: nUser | null;
  loading: boolean;
  setUser: (user: nUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<nUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        Cookies.set("token", token, { expires: 7 });
  
        // Fetch user cart from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        const cart = userDocSnap.exists() ? userDocSnap.data().cart || [] : [];
  
        setUser({ ...user, cart }); // ✅ Preserve existing cart
      } else {
        Cookies.remove("token");
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/auth");
  };


  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
