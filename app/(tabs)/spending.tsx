import { Card } from '@/src/components/ui/Card'
import { AnimatedSunflower } from '@/src/components/ui/AnimatedSunflower'
import { SpendingChart } from '@/src/components/ui/SpendingChart'
import { ThemeProvider, useTheme } from '@/src/styles/ThemeProvider'
import { useShoppingStore } from '@/src/store/shoppingStore'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useState, useMemo } from 'react'

type Period = 'week' | 'month'
type ChartType = 'bar' | 'line'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

function getLastNDays(n: number) {
  const days: Date[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    days.push(d)
  }
  return days
}

function getLastNMonths(n: number) {
  const months: { year: number; month: number }[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() })
  }
  return months
}

function Toggle<T extends string>({
  active,
  options,
  onChange,
}: {
  active: T
  options: { key: T; label: string }[]
  onChange: (v: T) => void
}) {
  const theme = useTheme()
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

function PageFour() {
  const theme = useTheme()
  const { items } = useShoppingStore()
  const [period, setPeriod] = useState<Period>('week')
  const [chartType, setChartType] = useState<ChartType>('bar')

  const weeklyData = useMemo(() => {
    const days = getLastNDays(7)
    return days.map((d) => {
      const key = toKey(d.getFullYear(), d.getMonth(), d.getDate())
      const total = items
        .filter((i) => i.date === key)
        .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
      return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), value: Math.round(total * 100) / 100 }
    })
  }, [items])

  const monthlyData = useMemo(() => {
    const months = getLastNMonths(12)
    return months.map(({ year, month }) => {
      const total = items
        .filter((i) => {
          const [y, m] = i.date.split('-').map(Number)
          return y === year && m - 1 === month
        })
        .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
      const label = new Date(year, month, 1).toLocaleDateString(undefined, { month: 'short' })
      return { label, value: Math.round(total * 100) / 100 }
    })
  }, [items])

  const activeData = period === 'week' ? weeklyData : monthlyData
  const periodTotal = activeData.reduce((sum, d) => sum + d.value, 0)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '500', color: theme.foreground }}>Spending</Text>
        <AnimatedSunflower
          source={require('@/assets/images/sunflowers/sun-flower.webp')}
          size={60}
        />
      </View>

      <Toggle
        active={period}
        onChange={setPeriod}
        options={[
          { key: 'week', label: 'Week' },
          { key: 'month', label: 'Month' },
        ]}
      />

      <Card>
        <Text style={{ fontSize: 12, color: theme.mutedForeground, marginBottom: 10 }}>
          {period === 'week' ? 'Last 7 days' : 'Last 12 months'}
        </Text>
        <View style={{ marginBottom: 14, alignSelf: 'flex-start', minWidth: 140 }}>
          <Toggle
            active={chartType}
            onChange={setChartType}
            options={[
              { key: 'bar', label: 'Bar' },
              { key: 'line', label: 'Line' },
            ]}
          />
        </View>
        <SpendingChart data={activeData} chartType={chartType} />
      </Card>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '500', color: theme.foreground }}>
          Total {period === 'week' ? 'this week' : 'last 12 months'}
        </Text>
        <Text style={{ fontSize: 17, fontWeight: '500', color: theme.primary }}>
          ${periodTotal.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  )
}

export default function Spending() {
  return (
    <ThemeProvider>
      <PageFour />
    </ThemeProvider>
  )
}
