"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type MenuItem = {
  id: number
  title: string
  description: string | null
  image: string | null
  price: string
  category: string | null
  isPopular: boolean
  isAvailable: boolean
  sortOrder: number
}

type CartItem = {
  menuItem: MenuItem
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (menuItem: MenuItem) => void
  removeFromCart: (menuItemId: number) => void
  updateQuantity: (menuItemId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cherdungCart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cherdungCart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItem.id === menuItem.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { menuItem, quantity: 1 }]
    })
  }

  const removeFromCart = (menuItemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== menuItemId))
  }

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.menuItem.price.replace(/[^0-9.]/g, '')) || 0
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
