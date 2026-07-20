import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { scheduleTaskNotifications, cancelTaskNotifications, TaskKind } from '@/src/utils/taskNotifications'

export type ListType = 'grocery' | 'shopping'

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  completed: boolean
  listType: ListType
  date: string // YYYY-MM-DD, used by Page 2 to show history
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
  addItem: (name: string, listType: ListType, quantity?: number, unitPrice?: number, date?: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updatePrice: (id: string, unitPrice: number) => void
  toggleCompleted: (id: string) => void
  deleteItem: (id: string) => void
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      items: [],
      activeListType: 'grocery',

      setActiveListType: (type) => set({ activeListType: type }),

      addItem: (name, listType, quantity = 1, unitPrice = 0, date) => {
        const trimmed = name.trim()
        if (!trimmed) return
        const finalDate = date || todayKey()
        const newItem: ShoppingItem = {
          id: Date.now().toString(),
          name: trimmed,
          quantity: Math.max(1, quantity),
          unitPrice: Math.max(0, unitPrice),
          completed: false,
          listType,
          date: finalDate,
        }
        set((state) => ({ items: [...state.items, newItem] }))
        scheduleTaskNotifications(listType as TaskKind, newItem.id, newItem.name, finalDate)
      },

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i)),
        })),

      updatePrice: (id, unitPrice) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, unitPrice: Math.max(0, unitPrice) } : i)),
        })),

      toggleCompleted: (id) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)),
        }))
        const item = get().items.find((i) => i.id === id)
        if (item?.completed) {
          cancelTaskNotifications(item.listType as TaskKind, id)
        }
      },

      deleteItem: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (item) {
          cancelTaskNotifications(item.listType as TaskKind, id)
        }
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },
    }),
    {
      name: 'shopping-list-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
