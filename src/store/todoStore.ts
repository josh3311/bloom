import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { scheduleTaskNotifications, cancelTaskNotifications } from '@/src/utils/taskNotifications'

export interface TodoTask {
  id: string
  title: string
  completed: boolean
  createdAt: number
  date: string // YYYY-MM-DD, used by Page 2 to show history
}

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`
}

interface TodoState {
  tasks: TodoTask[]
  addTask: (title: string, date?: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (title, date) => {
        const trimmed = title.trim()
        if (!trimmed) return
        const finalDate = date || todayKey()
        const newTask: TodoTask = {
          id: Date.now().toString(),
          title: trimmed,
          completed: false,
          createdAt: Date.now(),
          date: finalDate,
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        scheduleTaskNotifications('todo', newTask.id, newTask.title, finalDate)
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        }))
        const task = get().tasks.find((t) => t.id === id)
        if (task?.completed) {
          cancelTaskNotifications('todo', id)
        }
      },

      deleteTask: (id) => {
        cancelTaskNotifications('todo', id)
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },
    }),
    {
      name: 'todo-tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
