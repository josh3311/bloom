import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '@/src/styles/ThemeProvider'
import { Checkbox } from './Checkbox'
import { Counter } from './Counter'
import { ShoppingItem } from '@/src/store/shoppingStore'

interface ShoppingItemRowProps {
  item: ShoppingItem
  onQuantityChange: (quantity: number) => void
  onPriceChange: (price: number) => void
  onToggle: () => void
  onDelete: () => void
}

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`
}

export function ShoppingItemRow({
  item,
  onQuantityChange,
  onPriceChange,
  onToggle,
  onDelete,
}: ShoppingItemRowProps) {
  const theme = useTheme()
  const [priceText, setPriceText] = useState(item.unitPrice.toFixed(2))
  const total = item.quantity * item.unitPrice

  const commitPrice = () => {
    const parsed = parseFloat(priceText)
    const safe = isNaN(parsed) ? 0 : parsed
    onPriceChange(safe)
    setPriceText(safe.toFixed(2))
  }

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={styles.topRow}>
        <Pressable onPress={onToggle} hitSlop={6}>
          <Checkbox checked={item.completed} onChange={onToggle} />
        </Pressable>

        <Text
          style={[
            styles.name,
            {
              color: item.completed ? theme.mutedForeground : theme.foreground,
              textDecorationLine: item.completed ? 'line-through' : 'none',
            },
          ]}
        >
          {item.name}
        </Text>

        <Pressable onPress={onDelete} hitSlop={8}>
          <Text style={{ color: theme.destructive, fontSize: 12 }}>Delete</Text>
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        <Counter value={item.quantity} onChange={onQuantityChange} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>$</Text>
          <TextInput
            value={priceText}
            onChangeText={setPriceText}
            onBlur={commitPrice}
            onSubmitEditing={commitPrice}
            keyboardType="decimal-pad"
            style={[
              styles.priceInput,
              { color: theme.foreground, borderColor: theme.border, backgroundColor: theme.input },
            ]}
          />
          <Text style={{ color: theme.mutedForeground, fontSize: 11 }}>each</Text>
        </View>

        <Text style={[styles.total, { color: theme.foreground }]}>{formatPrice(total)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 32,
  },
  priceInput: {
    width: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 12,
    textAlign: 'right',
  },
  total: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 'auto',
  },
})
