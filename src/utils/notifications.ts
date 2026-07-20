import { getNotificationsModule, ensureNotificationsReady } from './notificationCore'

const REMINDER_IDS = {
  morning: 'reminder-morning',
  afternoon: 'reminder-afternoon',
  evening: 'reminder-evening',
}

export async function setupDailyReminders() {
  await ensureNotificationsReady()
  const Notifications = await getNotificationsModule()
  if (!Notifications) {
    console.log('Daily reminders skipped in Expo Go â€” will work in a real build.')
    return
  }

  const { status } = await Notifications.getPermissionsAsync()
  if (status !== 'granted') return

  await Promise.all(
    Object.values(REMINDER_IDS).map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => {})
    )
  )

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDS.morning,
    content: { title: 'Good morning', body: 'Time to plan your day â€” check your to-do list.' },
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
