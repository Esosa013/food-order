import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/lib/firebase";
import { CartItem } from "@/types/cart";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { menuItems } from "./constant";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const useMenu = () => {
  const { logout, user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [discount,setDiscount] = useState("");
  const [discountError,setDiscountError] = useState(false);
  const validDiscounts = ['abc','abc123','123abc'];

  useEffect(() => {
    let result = menuItems;
    
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category.includes(activeCategory));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.some(cat => cat.toLowerCase().includes(query))
      );
    }
    
    setFilteredItems(result);
  }, [activeCategory, searchQuery]);

  const categories = ['all', ...Array.from(new Set(menuItems.flatMap(item => item.category)))];
  
  const getTotalPrice = () => {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    if (discount) {
      if (validDiscounts.includes(discount)) {
        return total * 0.85;
      }
    }
  
    return total;
  };

  useEffect(() => {
    if (discount && !validDiscounts.includes(discount)) {
      setDiscountError(true);
    } else {
      setDiscountError(false);
    }
  }, [discount]);
  
  
  

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const generateReceiptPDF = (user: any, cart: CartItem[]) => {
    if (!user || cart.length === 0) {
      console.error("❌ Cannot generate receipt: Missing user or empty cart.");
      return;
    }
  
    const doc = new jsPDF();
    const orderTime = new Date().toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  
    // const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const formattedTotal = `₦${getTotalPrice().toFixed(2)}`;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Gourmet Delights", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("123 Street Name, City, Nigeria", 105, 28, { align: "center" });
    doc.text("+234 123 456 7890 | contact@business.com", 105, 34, { align: "center" });
  
    doc.setFontSize(14);
    doc.text("====================================", 20, 40);
    doc.setFont("helvetica", "bold");
    doc.text(`Customer: ${user.displayName || "Anonymous"}`, 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Order Time: ${orderTime}`, 20, 58);
    doc.text("====================================", 20, 65);
  
    const tableData = cart.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `₦${item.price.toFixed(2)}`,
      `₦${(item.price * item.quantity).toFixed(2)}`,
    ]);
  
    autoTable(doc, { 
      head: [["#", "Item", "Qty", "Unit Price", "Subtotal"]],
      body: tableData,
      startY: 70,
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 3 },
      headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] }
    });
  
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("====================================", 20, finalY);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${formattedTotal}`, 20, finalY + 10);
    doc.text("Thank you for your purchase!", 20, finalY + 20);
  
    const pdfBlob = doc.output("bloburl");
    window.open(pdfBlob, "_blank");
  };
  
  

const handleCheckout = async () => {
  try {
    localStorage.setItem('pendingOrder', JSON.stringify({ userId: user?.uid }));

    console.log("🛒 Sending payment request...");
    
    const response = await axios.post("/api/payment", {
      email: user?.email,
      items: [...cart],
      amount: getTotalPrice(),
    });

    console.log("✅ Payment response:", response);

    if (response.data.success && response.data.authorizationUrl) {
      window.location.href = response.data.authorizationUrl;
    } else {
      console.error("❌ Payment Failed:", response.data);
      toast({
        title: "Payment Initialization Failed",
        description: response.data.message || "Failed to start payment process",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("❌ Payment error:", error.response?.data || error.message);
    toast({
      title: "Payment Error",
      description: error.response?.data?.message || "An error occurred while processing your payment",
      variant: "destructive",
    });
  }
};


  const clearCart = async (userId: string) => {
    if (!userId) return;
  
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        cart: [],
      });
  
      console.log("✅ Cart emptied successfully");
    } catch (error) {
      console.error("❌ Error emptying cart:", error);
    }
  };
  
  const addToCart = async (userId: string, item: CartItem) => {
    if (!userId) {
      console.error("❌ No user ID provided");
      return;
    }
  
    console.log("🛒 Adding item to cart:", item);
  
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        cart: arrayUnion(item),
      });
  
      // ✅ Update local state
      setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          return prevCart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return [...prevCart, { ...item, quantity: 1 }];
      });
  
    } catch (error) {
      console.error("❌ Error adding item:", error);
    }
  };
  
  
  
  const removeFromCart = async (userId: string, item: CartItem) => {
    if (!userId) return;
  
    try {
      const userCartRef = doc(db, "users", userId);
      const userDoc = await getDoc(userCartRef);
  
      if (userDoc.exists()) {
        let cartData = userDoc.data().cart || [];
  
        cartData = cartData.filter((cartItem: CartItem) => cartItem.name !== item.name);
  
        await updateDoc(userCartRef, { cart: cartData });
        setCart(cartData); // Update local state
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  
  
  
  const updateCartItemQuantity = async (userId: string, itemName: string, newQuantity: number) => {
    if (!userId) return;
  
    try {
      const userCartRef = doc(db, "users", userId);
      const userDoc = await getDoc(userCartRef);
  
      if (userDoc.exists()) {
        let cartData = userDoc.data().cart || [];
  
        if (newQuantity <= 0) {
          // If new quantity is 0 or less, remove item completely
          cartData = cartData.filter((item: CartItem) => item.name !== itemName);
        } else {
          // Otherwise, update the item's quantity
          cartData = cartData.map((item: CartItem) =>
            item.name === itemName ? { ...item, quantity: newQuantity } : item
          );
        }
  
        await updateDoc(userCartRef, { cart: cartData });
        setCart(cartData); // Update local state
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };
  
  
  
  
  const getUserCart = async (userId: string) => {
    if (!userId) return;
  
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      setCart(userDoc.data()?.cart || []);
      console.log("🛒 Loaded cart:", userDoc.data()?.cart);
    } else {
      console.warn("⚠️ User document not found.");
    }
  };

  useEffect(() => {
    if (user?.uid) {
      getUserCart(user.uid);
    }
  }, [user?.uid]);
  
  

  return{
    isCartOpen,
    setIsCartOpen,
    cart,
    setCart,
    activeCategory,
    setActiveCategory,
    filteredItems,
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    categories,
    formatPrice,
    handleCheckout,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getUserCart,
    getTotalPrice,
    user,
    logout,
    clearCart,
    generateReceiptPDF,
    discountError,
    setDiscount,
    discount,
  };
};

  
