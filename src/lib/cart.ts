// src/lib/cart.ts - Shopping cart logic skeleton
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export interface CartItem {
  key: string;
  product: CartProduct;
  size?: string;
  quantity: number;
}

// Generate unique line key based on product ID and selected size
export function getCartLineKey(productId: string, size: string = ""): string {
  return `${productId}-${size}`;
}

// Add an item to the cart (or increment quantity if already in cart)
export function addItemToCart(
  cart: CartItem[],
  product: CartProduct,
  size: string = "",
  qtyToAdd: number = 1
): CartItem[] {
  if (product.stock < 1) return cart;

  const key = getCartLineKey(product.id, size);
  const existingIndex = cart.findIndex((item) => item.key === key);

  if (existingIndex > -1) {
    const existing = cart[existingIndex];
    if (!existing) return cart;
    const newQty = Math.min(product.stock, existing.quantity + qtyToAdd);
    const updated = [...cart];
    updated[existingIndex] = { ...existing, quantity: newQty };
    return updated;
  }

  return [
    ...cart,
    {
      key,
      product,
      size,
      quantity: Math.min(product.stock, Math.max(1, qtyToAdd)),
    },
  ];
}

// Remove an item by line key
export function removeItemFromCart(cart: CartItem[], key: string): CartItem[] {
  return cart.filter((item) => item.key !== key);
}

// Update quantity (bounded between 1 and available stock)
export function updateCartQuantity(
  cart: CartItem[],
  key: string,
  newQuantity: number
): CartItem[] {
  if (newQuantity <= 0) {
    return removeItemFromCart(cart, key);
  }

  return cart.map((item) => {
    if (item.key !== key) return item;
    const safeQty = Math.min(item.product.stock, Math.max(1, Math.floor(newQuantity)));
    return { ...item, quantity: safeQty };
  });
}

// Calculate cart subtotal
export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

// Calculate shipping fee (example: free shipping over $150, else $8)
export function calculateShipping(subtotal: number): number {
  if (subtotal === 0 || subtotal >= 150) return 0;
  return 8;
}
