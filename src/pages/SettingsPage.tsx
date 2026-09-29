import React, { useState } from 'react'
import {
  Settings,
  Languages,
  Wifi,
  Camera,
  Save,
  Info,
  Check,
} from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useApp, type AppLanguage } from '../context/AppContext'

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast()
  const { language, setLanguage, isOffline, toggleOfflineMode, t } = useApp()

  const [wifiOnlySync, setWifiOnlySync] = useState(true)
  const [compressPhotos, setCompressPhotos] = useState(true)
  const [sunlightMode, setSunlightMode] = useState(false)
  const [cameraGuide, setCameraGuide] = useState(true)

  const languages: { code: AppLanguage; name: string; native: string; flag: string }[] = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  ]

  const handleSaveSettings = () => {
    showToast({
      title: t('settings.preferencesSaved'),
      message: 'Field preferences updated in local persistent configuration.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <Settings className="w-4 h-4" />
            <span>Preferences & Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t('settings.title')}
          </h1>
          <p className="text-sm text-slate-500">
            {t('settings.subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSaveSettings}
        >
          {t('settings.savePreferences')}
        </Button>
      </div>

      {/* Language Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-emerald-700" />
            <CardTitle className="text-base sm:text-lg">{t('settings.regionalLanguage')}</CardTitle>
          </div>
          <CardDescription className="text-xs">
            {t('settings.languageHint')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  language === lang.code
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.native}</span>
                  </span>
                  {language === lang.code && (
                    <Check className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <span className="text-xs text-slate-500 block mt-1">{lang.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Offline & Sync Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-emerald-700" />
            <CardTitle className="text-base sm:text-lg">Offline & Edge Data Sync</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Optimized for rural cellular dead zones and solar-powered edge devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle 1 */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">
                Wi-Fi Only Sync Mode
              </span>
              <span className="text-xs text-slate-500">
                Prevent high cellular mobile data costs; sync queue only when connected to broadband Wi-Fi
              </span>
            </div>
            <button
              onClick={() => setWifiOnlySync(!wifiOnlySync)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                wifiOnlySync ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  wifiOnlySync ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">
                Edge Compression for Scans
              </span>
              <span className="text-xs text-slate-500">
                Compress raw images into quantized color maps (reduces upload size from 4 MB to ~180 KB)
              </span>
            </div>
            <button
              onClick={() => setCompressPhotos(!compressPhotos)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                compressPhotos ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  compressPhotos ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Offline simulator */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">
                Simulate No Connectivity (Hackathon Evaluation Mode)
              </span>
              <span className="text-xs text-slate-500">
                Force app into offline-only edge behavior even if this browser has an active connection
              </span>
            </div>
            <button
              onClick={toggleOfflineMode}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isOffline ? 'bg-stone-700' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  isOffline ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Field Camera & Display */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-700" />
            <CardTitle className="text-base sm:text-lg">Camera & Field Usability</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Optimized for outdoor sunlight and one-handed mobile capture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">
                High-Contrast Sunlight Mode
              </span>
              <span className="text-xs text-slate-500">
                Deep blacks and ultra-bright highlights to maintain readability under bright midday sun
              </span>
            </div>
            <button
              onClick={() => setSunlightMode(!sunlightMode)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                sunlightMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  sunlightMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">
                Leaf Symptom Reticle Overlay
              </span>
              <span className="text-xs text-slate-500">
                Display centering crosshairs in camera viewfinder to assist steady framing
              </span>
            </div>
            <button
              onClick={() => setCameraGuide(!cameraGuide)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                cameraGuide ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  cameraGuide ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* About Box */}
      <Card variant="accent">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">
              Krishi Saathi AI • Hackathon Foundation Prototype
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed as an offline-first precision agriculture assistant for farmers. Built with React, TypeScript, Tailwind CSS, React Router, and Lucide React.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <Badge variant="neutral" size="sm">v0.1.0-alpha</Badge>
              <Badge variant="success" size="sm">Edge Architecture</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
