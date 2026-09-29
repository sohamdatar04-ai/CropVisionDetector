export type StressSeverity = 'low' | 'moderate' | 'high' | 'critical'

export interface FieldPlot {
  id: string
  name: string
  crop: string
  acreage: number
  sowingDate: string
  currentStage: string
  healthScore: number // 0-100
  lastScanned: string
  stressDetected?: string
}

export interface ScanRecord {
  id: string
  fieldId: string
  fieldName: string
  crop: string
  timestamp: string
  imageUrl?: string
  stressType: string
  confidence: number
  severity: StressSeverity
  recommendationSummary: string
  offlineProcessed: boolean
  synced: boolean
}

export interface WeatherDay {
  day: string
  date: string
  tempMax: number
  tempMin: number
  condition: string
  rainfallProb: number
  humidity: number
  windSpeed: number
  advisoryNote: string
}

export interface AppNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'alert'
  timestamp: string
  read: boolean
}
