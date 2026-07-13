import React from 'react'
import { BarChart, LineChart } from 'react-native-gifted-charts'
import { useTheme } from '@/src/styles/ThemeProvider'

interface SpendingChartProps {
  data: { label: string; value: number }[]
  chartType: 'bar' | 'line'
}

export function SpendingChart({ data, chartType }: SpendingChartProps) {
  const theme = useTheme()
  const chartData = data.map((d) => ({ value: d.value, label: d.label }))

  if (chartType === 'bar') {
    return (
      <BarChart
        data={chartData}
        barWidth={22}
        spacing={18}
        roundedTop
        frontColor={theme.primary}
        yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
        rulesColor={theme.border}
        xAxisColor={theme.border}
        yAxisColor={theme.border}
        noOfSections={4}
        height={160}
        initialSpacing={10}
        yAxisLabelPrefix="$"
      />
    )
  }

  return (
    <LineChart
      data={chartData}
      color={theme.primary}
      thickness={2}
      dataPointsColor={theme.primary}
      yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
      xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
      rulesColor={theme.border}
      xAxisColor={theme.border}
      yAxisColor={theme.border}
      noOfSections={4}
      height={160}
      initialSpacing={10}
      curved
      yAxisLabelPrefix="$"
    />
  )
}
