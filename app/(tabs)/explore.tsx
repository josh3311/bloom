import { Card } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Counter } from '@/src/components/ui/Counter'
import { CalendarGrid } from '@/src/components/ui/CalendarGrid'
import { HistoryItemRow } from '@/src/components/ui/HistoryItemRow'
import { ThemeProvider, useTheme } from '@/src/styles/ThemeProvider'
import { useCalendarStore } from '@/src/store/calendarStore'
import { useTodoStore } from '@/src/store/todoStore'
import { useShoppingStore, ListType } from '@/src/store/shoppingStore'
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native'
import { useState, useMemo } from 'react'
import { AnimatedSunflower } from '@/src/components/ui/AnimatedSunflower'

function selectedDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const label = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
  return isToday ? `Today â€” ${label}` : label
}

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`
}

function MiniToggle({
  active,
  onChange,
}: {
  active: ListType
  onChange: (t: ListType) => void
}) {
  const theme = useTheme()
  const options: { key: ListType; label: string }[] = [
    { key: 'grocery', label: 'Grocery' },
    { key: 'shopping', label: 'Shopping' },
  ]
  return (
    <View style={{ flexDirection: 'row', backgroundColor: theme.border, borderRadius: 10, padding: 3, gap: 3 }}>
      {options.map((opt) => {
        const isActive = active === opt.key
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: isActive ? theme.backgroundSecondary : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isActive ? '500' : '400',
                color: isActive ? theme.foreground : theme.mutedForeground,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

function PageTwo() {
  const theme = useTheme()
  const { selectedDate, viewYear, viewMonth, setSelectedDate, goToPrevMonth, goToNextMonth } =
    useCalendarStore()
  const { tasks: todoTasks, addTask, toggleTask } = useTodoStore()
  const { items: shoppingItems, addItem, toggleCompleted } = useShoppingStore()

  const [todoDraft, setTodoDraft] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemQty, setItemQty] = useState(1)
  const [itemPrice, setItemPrice] = useState('')
  const [miniListType, setMiniListType] = useState<ListType>('grocery')

  const datesWithActivity = useMemo(() => {
    const s = new Set<string>()
    todoTasks.forEach((t) => s.add(t.date))
    shoppingItems.forEach((i) => s.add(i.date))
    return s
  }, [todoTasks, shoppingItems])

  const dayTodoTasks = todoTasks.filter((t) => t.date === selectedDate)
  const dayGroceryItems = shoppingItems.filter((i) => i.date === selectedDate && i.listType === 'grocery')
  const dayShoppingItems = shoppingItems.filter((i) => i.date === selectedDate && i.listType === 'shopping')
  const groceryTotal = dayGroceryItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const shoppingTotal = dayShoppingItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  const hasAnyActivity = dayTodoTasks.length > 0 || dayGroceryItems.length > 0 || dayShoppingItems.length > 0

  const handleAddTodo = () => {
    if (!todoDraft.trim()) return
    addTask(todoDraft, selectedDate)
    setTodoDraft('')
  }

  const handleAddItem = () => {
    if (!itemName.trim()) return
    const parsedPrice = parseFloat(itemPrice)
    addItem(itemName, miniListType, itemQty, isNaN(parsedPrice) ? 0 : parsedPrice, selectedDate)
    setItemName('')
    setItemQty(1)
    setItemPrice('')
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '500', color: theme.foreground }}>Calendar</Text>
        <AnimatedSunflower
          source={require('@/assets/images/sunflowers/sunflower-3d1.webp')}
          size={60}
        />
      </View>

      <Card>
        <CalendarGrid
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          datesWithTasks={datesWithActivity}
          onSelectDate={setSelectedDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />
      </Card>

      <Text style={{ fontSize: 13, color: theme.mutedForeground }}>
        {selectedDateLabel(selectedDate)}
      </Text>

      <Card>
        <Text style={{ fontSize: 12, color: theme.mutedForeground, marginBottom: 8 }}>
          Add a to-do for this day
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Input placeholder="Task name" value={todoDraft} onChangeText={setTodoDraft} />
          </View>
          <Button onPress={handleAddTodo} disabled={!todoDraft.trim()}>
            Add
          </Button>
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 12, color: theme.mutedForeground, marginBottom: 8 }}>
          Add a grocery or shopping item for this day
        </Text>
        <View style={{ marginBottom: 10 }}>
          <MiniToggle active={miniListType} onChange={setMiniListType} />
        </View>
        <Input
          placeholder="Item name"
          value={itemName}
          onChangeText={setItemName}
          style={{ marginBottom: 10 }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Counter value={itemQty} onChange={setItemQty} />
          <TextInput
            placeholder="0.00"
            placeholderTextColor={theme.mutedForeground}
            value={itemPrice}
            onChangeText={setItemPrice}
            keyboardType="decimal-pad"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.input,
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 10,
              color: theme.foreground,
              fontSize: 13,
            }}
          />
          <Button onPress={handleAddItem} disabled={!itemName.trim()}>
            Add
          </Button>
        </View>
      </Card>

      {!hasAnyActivity ? (
        <Card>
          <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
            Nothing tracked for this day
          </Text>
        </Card>
      ) : (
        <>
          {dayTodoTasks.length > 0 && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <Text style={[styles.sectionLabel, { color: theme.mutedForeground }]}>To-Do</Text>
              {dayTodoTasks.map((task) => (
                <HistoryItemRow
                  key={task.id}
                  name={task.title}
                  completed={task.completed}
                  onToggle={() => toggleTask(task.id)}
                />
              ))}
            </Card>
          )}

          {dayGroceryItems.length > 0 && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionLabel, { color: theme.mutedForeground }]}>Grocery</Text>
                <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '500' }}>
                  Total {formatPrice(groceryTotal)}
                </Text>
              </View>
              {dayGroceryItems.map((item) => (
                <HistoryItemRow
                  key={item.id}
                  name={item.name}
                  completed={item.completed}
                  onToggle={() => toggleCompleted(item.id)}
                  total={formatPrice(item.quantity * item.unitPrice)}
                />
              ))}
            </Card>
          )}

          {dayShoppingItems.length > 0 && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionLabel, { color: theme.mutedForeground }]}>Shopping</Text>
                <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '500' }}>
                  Total {formatPrice(shoppingTotal)}
                </Text>
              </View>
              {dayShoppingItems.map((item) => (
                <HistoryItemRow
                  key={item.id}
                  name={item.name}
                  completed={item.completed}
                  onToggle={() => toggleCompleted(item.id)}
                  total={formatPrice(item.quantity * item.unitPrice)}
                />
              ))}
            </Card>
          )}
        </>
      )}
    </ScrollView>
  )
}

const styles = {
  sectionLabel: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
}

export default function CalendarPage() {
  return (
    <ThemeProvider>
      <PageTwo />
    </ThemeProvider>
  )
}
