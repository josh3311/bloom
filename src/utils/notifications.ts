import Constants from 'expo-constants'
import { Platform } from 'react-native'

const REMINDER_IDS = {
  morning: 'reminder-morning',
  afternoon: 'reminder-afternoon',
  evening: 'reminder-evening',
}

export async function setupDailyReminders() {
  // expo-notifications crashes on import inside Expo Go (SDK 53+ removed push there).
  // Skip entirely when running in Expo Go — this works correctly in a real build.
  if (Constants.appOwnership === 'expo') {
    console.log('Daily reminders skipped in Expo Go — will work in a real build.')
    return
  }

  const Notifications = await import('expo-notifications')

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminders', {
      name: 'Daily reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return

  await Promise.all(
    Object.values(REMINDER_IDS).map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => {})
    )
  )

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDS.morning,
    content: { title: 'Good morning', body: 'Time to plan your day — check your to-do list.' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 8, minute: 0 },
  })

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDS.afternoon,
    content: { title: 'Afternoon check-in', body: "See what's left to do today." },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 13, minute: 0 },
  })

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDS.evening,
    content: { title: 'Evening wrap-up', body: 'Anything left to finish before the day ends?' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 19, minute: 0 },
  })
}
