import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ListType = 'grocery' | 'shopping'

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  completed: boolean
  listType: ListType
  date: string
}

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`
}

interface ShoppingState {
  items: ShoppingItem[]
  activeListType: ListType
  setActiveListType: (type: ListType) => void
  addItem: (name: string, quantity?: number, unitPrice?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  updatePrice: (id: string, unitPrice: number) => void
  toggleCompleted: (id: string) => void
  deleteItem: (id: string) => void
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set) => ({
      items: [],
      activeListType: 'grocery',

      setActiveListType: (type) => set({ activeListType: type }),

      addItem: (name, quantity = 1, unitPrice = 0) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((state) => ({
          items: [
            ...state.items,
            {
              id: Date.now().toString(),
              name: trimmed,
              quantity: Math.max(1, quantity),
              unitPrice: Math.max(0, unitPrice),
              completed: false,
              listType: state.activeListType,
              date: todayKey(),
            },
          ],
        }))
      },

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i)),
        })),

      updatePrice: (id, unitPrice) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, unitPrice: Math.max(0, unitPrice) } : i)),
        })),

      toggleCompleted: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
    }),
    {
      name: 'shopping-list-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
