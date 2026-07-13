// Kodama Grove theme tokens — matched exactly to reference screenshots
// Purple is the one deliberate departure, reserved for buttons/selection only

export const lightTheme = {
  background: '#EAE0C4',
  backgroundSecondary: '#F3EBD3',
  foreground: '#3D3624',
  mutedForeground: '#6B6248',
  border: '#DCD1AC',
  chartAccent: '#7C9143',       // sage/olive — checkmarks, completed states
  primary: '#8B5FA8',           // warm purple — buttons only
  primaryForeground: '#FBF8F2',
  primaryHover: '#7A4F96',
  secondary: '#E8C547',         // warm yellow — secondary actions
  secondaryForeground: '#3D3624',
  destructive: '#A65C42',
  input: '#F3EBD3',
  ring: '#8B5FA8',
  radius: 8,
} as const

export const darkTheme = {
  background: '#1F1C16',
  backgroundSecondary: '#3D3829',
  foreground: '#F0E6D2',
  mutedForeground: '#B8AD94',
  border: '#524B38',
  chartAccent: '#9BAE87',
  primary: '#A578C4',
  primaryForeground: '#241A2C',
  primaryHover: '#B58ED4',
  secondary: '#C9A93D',
  secondaryForeground: '#241A2C',
  destructive: '#C17A5F',
  input: '#3D3829',
  ring: '#A578C4',
  radius: 8,
} as const

export type Theme = typeof lightTheme
