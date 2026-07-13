import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'
import { TaskItem } from '@/src/components/ui/TaskItem'
import { ThemeProvider, useTheme } from '@/src/styles/ThemeProvider'
import { useTodoStore } from '@/src/store/todoStore'
import { useThemeMode } from '@/src/store/themeModeStore'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { AnimatedSunflower } from '@/src/components/ui/AnimatedSunflower'
import { CelebrationOverlay } from '@/src/components/ui/CelebrationOverlay'
import { useState, useEffect, useRef } from 'react'

function todayLabel() {
  const now = new Date()
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' })
  const date = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
  return { weekday, date }
}

function PageOne() {
  const theme = useTheme()
  const { mode, toggleMode } = useThemeMode()
  const { tasks, addTask, toggleTask, deleteTask } = useTodoStore()
  const [draft, setDraft] = useState('')
  const { weekday, date } = todayLabel()

  const [showCelebration, setShowCelebration] = useState(false)
  const prevAllDoneRef = useRef(false)

  useEffect(() => {
    const allDone = tasks.length > 0 && tasks.every((t) => t.completed)
    if (allDone && !prevAllDoneRef.current) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 5600)
    }
    prevAllDoneRef.current = allDone
  }, [tasks])

  const handleAdd = () => {
    addTask(draft)
    setDraft('')
  }

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <AnimatedSunflower
            source={require('@/assets/images/sunflowers/sun-flower.webp')}
            size={60}
          />
          <View>
            <Text style={{ fontSize: 12, color: theme.mutedForeground }}>{weekday}</Text>
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme.foreground, marginTop: 2 }}>
              {date}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={toggleMode}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.backgroundSecondary,
          }}
        >
          <Text style={{ fontSize: 12, color: theme.foreground }}>
            {mode === 'light' ? 'Light' : 'Dark'}
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="What do you need to do?"
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
        </View>
        <Button onPress={handleAdd} disabled={!draft.trim()}>
          Add
        </Button>
      </View>

      {tasks.length === 0 ? (
        <Card>
          <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
            Nothing added yet
          </Text>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              completed={task.completed}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </Card>
      )}
    </ScrollView>
    {showCelebration && <CelebrationOverlay />}
    </View>
  )
}

export default function Index() {
  return (
    <ThemeProvider>
      <PageOne />
    </ThemeProvider>
  )
}
