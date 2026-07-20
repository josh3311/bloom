import { getNotificationsModule, ensureNotificationsReady } from './notificationCore'

export type TaskKind = 'todo' | 'grocery' | 'shopping'

// Schedules two one-off local notifications for a task/item with a specific date:
// 1. An "approaching" notice at 7:00 PM the evening before
// 2. A same-day check at 8:00 AM â€” this one gets cancelled automatically if the
//    task is marked done before that time (see cancelTaskNotifications)
export async function scheduleTaskNotifications(
  kind: TaskKind,
  id: string,
  title: string,
  dateStr: string
) {
  await ensureNotificationsReady()
  const Notifications = await getNotificationsModule()
  if (!Notifications) return

  const { status } = await Notifications.getPermissionsAsync()
  if (status !== 'granted') return

  const [y, m, d] = dateStr.split('-').map(Number)
  const now = new Date()

  const approachDate = new Date(y, m - 1, d - 1, 19, 0, 0)
  if (approachDate.getTime() > now.getTime()) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${kind}-approach-${id}`,
      content: {
        title: 'Coming up tomorrow',
        body: `"${title}" is planned for tomorrow.`,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: approachDate },
    })
  }

  const morningDate = new Date(y, m - 1, d, 8, 0, 0)
  if (morningDate.getTime() > now.getTime()) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${kind}-morning-${id}`,
      content: {
        title: 'Still on your list',
        body: `"${title}" is due today and isn't done yet.`,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: morningDate },
    })
  }
}

// Called when a task/item is completed or deleted â€” cancels its pending
// notifications so a completed task never triggers the "not done yet" alert.
export async function cancelTaskNotifications(kind: TaskKind, id: string) {
  const Notifications = await getNotificationsModule()
  if (!Notifications) return
  await Notifications.cancelScheduledNotificationAsync(`${kind}-approach-${id}`).catch(() => {})
  await Notifications.cancelScheduledNotificationAsync(`${kind}-morning-${id}`).catch(() => {})
}
