"use client";
import { LogOut, ShoppingCart, Search, ChevronLeft, ChevronRight, Minus, Plus, Trash2, X } from "lucide-react";
import { useMenu } from "./useMenu";
import { motion } from "framer-motion";

export default function MenuPage() {
  const {
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
    getTotalPrice,
    user,
    logout,
    discount,
    setDiscount,
    discountError,
  } = useMenu();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Gourmet
              </span>
              <span>Delights</span>
            </h1>
          </div>

          <div className="flex items-center space-x-5">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search our menu..."
                className={`pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isSearchFocused ? "w-80" : "w-64"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="md:hidden px-4 py-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search our menu..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-[40vh] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200)",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4"
          >
            Culinary Excellence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/90 max-w-xl text-lg md:text-xl"
          >
            Artfully crafted dishes delivered to your doorstep
          </motion.p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex overflow-x-auto scrollbar-hide py-2 mb-8">
          <div className="flex space-x-3 mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 shadow hover:shadow-md"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-4 text-white w-full">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.category.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-lg text-indigo-600">
                    {formatPrice(item.price)}
                  </span>

                  <button
                    onClick={() =>
                      user?.uid && addToCart(user.uid, { ...item, quantity: 1 })
                    }
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="py-6 px-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-xl font-medium text-gray-600 mb-1">
                  Your cart is empty
                </p>
                <p className="text-gray-400 text-center mb-6">
                  Add items to get started with your order
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium transition-all hover:from-indigo-700 hover:to-purple-700"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex bg-gray-50 rounded-xl p-4 items-center"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-indigo-600 font-medium">
                        {formatPrice(item.price)}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() =>
                            user?.uid &&
                            updateCartItemQuantity(
                              user.uid,
                              item.name,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="mx-3 w-6 text-center text-gray-800 font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            user?.uid &&
                            updateCartItemQuantity(
                              user.uid,
                              item.name,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => user?.uid && removeFromCart(user.uid, item)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    {formatPrice(getTotalPrice() ?? 0)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex items-center">
                    <input
                      id="promo"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      type="text"
                      placeholder="Enter code"
                      className="px-4 py-2.5 rounded-l-lg bg-white text-indigo-600 border border-gray-300 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  {discountError && (
                    <span className="text-red-500 text-sm block mt-1">
                      Invalid code
                    </span>
                  )}
                </div>
              </div>

              <button
                disabled={discountError}
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center"
              >
                Proceed to Checkout
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
          </div>
          )}
        </div>
      </div>
      
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
              