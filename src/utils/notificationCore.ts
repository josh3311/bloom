import Constants from 'expo-constants'

let cachedModule: any = undefined
let readyPromise: Promise<void> | null = null

// expo-notifications crashes on import inside Expo Go (SDK 53+ removed push there).
// This lazily loads it only in a real build, and caches null when running in Expo Go.
export async function getNotificationsModule() {
  if (cachedModule !== undefined) return cachedModule
  if (Constants.appOwnership === 'expo') {
    cachedModule = null
    return null
  }
  const mod = await import('expo-notifications')
  cachedModule = mod
  return mod
}

export async function ensureNotificationsReady() {
  if (readyPromise) return readyPromise
  readyPromise = (async () => {
    const Notifications = await getNotificationsModule()
    if (!Notifications) return

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    })

    const { Platform } = await import('react-native')
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    if (existingStatus !== 'granted') {
      await Notifications.requestPermissionsAsync()
    }
  })()
  return readyPromise
}
