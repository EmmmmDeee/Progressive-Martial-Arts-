import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string, size?: string) => void;
  updateQty: (productId: string, size: string | undefined, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

function sameLine(a: CartItem, productId: string, size?: string) {
  return a.productId === productId && (a.size || "") === (size || "");
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (item, qty = 1) => {
        set((s) => {
          const existing = s.items.find((i) => sameLine(i, item.productId, item.size));
          if (existing) {
            return {
              items: s.items.map((i) =>
                sameLine(i, item.productId, item.size)
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...s.items, { ...item, qty }], isOpen: true };
        });
      },
      remove: (productId, size) =>
        set((s) => ({
          items: s.items.filter((i) => !sameLine(i, productId, size)),
        })),
      updateQty: (productId, size, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              sameLine(i, productId, size) ? { ...i, qty: Math.max(0, qty) } : i
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "pmaai-cart" }
  )
);
