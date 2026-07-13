import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface TodoTask {
  id: string
  title: string
  completed: boolean
  createdAt: number
  date: string
}

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`
}

interface TodoState {
  tasks: TodoTask[]
  addTask: (title: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (title) => {
        const trimmed = title.trim()
        if (!trimmed) return
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now().toString(),
              title: trimmed,
              completed: false,
              createdAt: Date.now(),
              date: todayKey(),
            },
          ],
        }))
      },

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'todo-tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
