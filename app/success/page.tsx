'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { useMenu } from "../useMenu";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const { clearCart, generateReceiptPDF } = useMenu();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!user) {
        console.error("No user found");
        toast({
          title: "Error",
          description: "User not found. Redirecting...",
          variant: "destructive",
        });
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        const { uid, cart = [] } = user;

        // ✅ Clear the cart in Firestore or local state
        await clearCart(uid);

        // ✅ Generate a receipt if cart is not empty
        if (cart.length > 0) {
          generateReceiptPDF(user, cart);
        }

        toast({
          title: "Purchase Successful",
          description: "Your order will arrive within an hour.",
        });

        // ✅ Remove pending order from localStorage
        localStorage.removeItem('pendingOrder');
      } catch (error) {
        console.error("Error processing payment success:", error);
        toast({
          title: "Transaction Error",
          description: "Failed to complete your purchase",
          variant: "destructive",
        });
      } finally {
        // ✅ Redirect user after 3 seconds
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handlePaymentSuccess();
  }, [router, user]); // ✅ Removed `cart` from dependencies

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Processing Your Payment</h1>
        
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-t-purple-600 border-b-purple-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Please wait while we confirm your purchase...</p>
          </div>
        ) : (
          <p className="text-center text-green-600">Redirecting you back to the app...</p>
        )}
      </div>
    </div>
  );
}
