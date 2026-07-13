import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/src/components/haptic-tab';
import { setupDailyReminders } from '@/src/utils/notifications';

const PURPLE = '#8B5FA8';

export default function TabLayout() {
  useEffect(() => {
    setupDailyReminders()
  }, [])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PURPLE,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'To-Do',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="spending"
        options={{
          title: 'Spending',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size ?? 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
