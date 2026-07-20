import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'
import { TaskItem } from '@/src/components/ui/TaskItem'
import { DatePickerModal } from '@/src/components/ui/DatePickerModal'
import { ThemeProvider, useTheme } from '@/src/styles/ThemeProvider'
import { useTodoStore } from '@/src/store/todoStore'
import { useThemeMode } from '@/src/store/themeModeStore'
import { AnimatedSunflower } from '@/src/components/ui/AnimatedSunflower'
import { CelebrationOverlay } from '@/src/components/ui/CelebrationOverlay'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useState, useEffect, useRef } from 'react'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function todayLabel() {
  const now = new Date()
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' })
  const date = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
  return { weekday, date }
}

function formatDateShort(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function PageOne() {
  const theme = useTheme()
  const { mode, toggleMode } = useThemeMode()
  const { tasks, addTask, toggleTask, deleteTask } = useTodoStore()
  const [draft, setDraft] = useState('')
  const [plannedDate, setPlannedDate] = useState(todayKey())
  const [pickerVisible, setPickerVisible] = useState(false)
  const { weekday, date } = todayLabel()

  const todayTasks = tasks.filter((t) => t.date === todayKey())

  const [showCelebration, setShowCelebration] = useState(false)
  const prevAllDoneRef = useRef(false)

  useEffect(() => {
    const allDone = todayTasks.length > 0 && todayTasks.every((t) => t.completed)
    if (allDone && !prevAllDoneRef.current) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 5600)
    }
    prevAllDoneRef.current = allDone
  }, [todayTasks])

  const handleAdd = () => {
    addTask(draft, plannedDate)
    setDraft('')
    setPlannedDate(todayKey())
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

      <Pressable onPress={() => setPickerVisible(true)} style={{ alignSelf: 'flex-start' }}>
        <Text style={{ fontSize: 12, color: theme.primary }}>
          {plannedDate === todayKey() ? 'For: Today' : `For: ${formatDateShort(plannedDate)}`}
        </Text>
      </Pressable>

      {todayTasks.length === 0 ? (
        <Card>
          <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
            Nothing added yet
          </Text>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {todayTasks.map((task) => (
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
    <DatePickerModal
      visible={pickerVisible}
      value={plannedDate}
      onChange={(d) => {
        setPlannedDate(d)
        setPickerVisible(false)
      }}
      onClose={() => setPickerVisible(false)}
    />
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
