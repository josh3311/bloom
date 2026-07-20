import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'
import { Counter } from '@/src/components/ui/Counter'
import { ShoppingItemRow } from '@/src/components/ui/ShoppingItemRow'
import { DatePickerModal } from '@/src/components/ui/DatePickerModal'
import { ThemeProvider, useTheme } from '@/src/styles/ThemeProvider'
import { useShoppingStore, ListType } from '@/src/store/shoppingStore'
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { AnimatedSunflower } from '@/src/components/ui/AnimatedSunflower'
import { CelebrationOverlay } from '@/src/components/ui/CelebrationOverlay'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function formatDateShort(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function ListToggle({
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
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.border,
        borderRadius: 10,
        padding: 3,
        gap: 3,
      }}
    >
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

function PageThree() {
  const theme = useTheme()
  const {
    items,
    activeListType,
    setActiveListType,
    addItem,
    updateQuantity,
    updatePrice,
    toggleCompleted,
    deleteItem,
  } = useShoppingStore()

  const [nameDraft, setNameDraft] = useState('')
  const [qtyDraft, setQtyDraft] = useState(1)
  const [priceDraft, setPriceDraft] = useState('')
  const [plannedDate, setPlannedDate] = useState(todayKey())
  const [pickerVisible, setPickerVisible] = useState(false)

  const visibleItems = items.filter(
    (i) => i.listType === activeListType && i.date === todayKey()
  )
  const grandTotal = visibleItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  const [showCelebration, setShowCelebration] = useState(false)
  const prevAllDoneRef = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const allDone = visibleItems.length > 0 && visibleItems.every((i) => i.completed)
    const prev = prevAllDoneRef.current[activeListType] ?? false
    if (allDone && !prev) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 5600)
    }
    prevAllDoneRef.current[activeListType] = allDone
  }, [visibleItems, activeListType])

  const handleAdd = () => {
    if (!nameDraft.trim()) return
    const parsedPrice = parseFloat(priceDraft)
    addItem(nameDraft, activeListType, qtyDraft, isNaN(parsedPrice) ? 0 : parsedPrice, plannedDate)
    setNameDraft('')
    setQtyDraft(1)
    setPriceDraft('')
    setPlannedDate(todayKey())
  }

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '500', color: theme.foreground }}>Grocery & Shopping</Text>
        <AnimatedSunflower
          source={require('@/assets/images/sunflowers/sunflower_3d.webp')}
          size={60}
        />
      </View>

      <ListToggle active={activeListType} onChange={setActiveListType} />

      <Card>
        <Text style={{ fontSize: 12, color: theme.mutedForeground, marginBottom: 8 }}>
          Add an item
        </Text>
        <Input
          placeholder="Item name"
          value={nameDraft}
          onChangeText={setNameDraft}
          style={{ marginBottom: 10 }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Counter value={qtyDraft} onChange={setQtyDraft} />
          <TextInput
            placeholder="0.00"
            placeholderTextColor={theme.mutedForeground}
            value={priceDraft}
            onChangeText={setPriceDraft}
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
          <Button onPress={handleAdd} disabled={!nameDraft.trim()}>
            Add
          </Button>
        </View>
        <Pressable onPress={() => setPickerVisible(true)} style={{ alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 12, color: theme.primary }}>
            {plannedDate === todayKey() ? 'For: Today' : `For: ${formatDateShort(plannedDate)}`}
          </Text>
        </Pressable>
      </Card>

      {visibleItems.length === 0 ? (
        <Card>
          <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
            No items yet
          </Text>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {visibleItems.map((item) => (
            <ShoppingItemRow
              key={item.id}
              item={item}
              onQuantityChange={(q) => updateQuantity(item.id, q)}
              onPriceChange={(p) => updatePrice(item.id, p)}
              onToggle={() => toggleCompleted(item.id)}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </Card>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '500', color: theme.foreground }}>
          Grand total
        </Text>
        <Text style={{ fontSize: 17, fontWeight: '500', color: theme.primary }}>
          ${grandTotal.toFixed(2)}
        </Text>
      </View>
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

export default function Shopping() {
  return (
    <ThemeProvider>
      <PageThree />
    </ThemeProvider>
  )
}
