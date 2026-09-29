import React from 'react'
import { Link } from 'react-router-dom'
import {
  Scan,
  Mic,
  MapPin,
  History,
  Activity,
  Thermometer,
  Droplets,
  Sprout,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  Bot,
  RefreshCw,
} from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from '../components/ui'
import { useApp } from '../context/AppContext'

export const DashboardPage: React.FC = () => {
  const { isOffline, toggleOfflineMode, offlineQueueCount, t } = useApp()

  // Realistic mock data for recent crop analyses
  const recentAnalyses = [
    {
      id: 'scan-tomato-01',
      field: 'Farm A',
      crop: 'Tomato (Abhinav Hybrid)',
      timestamp: 'Today, 09:40 AM',
      diagnosis: 'Early Blight (Alternaria solani)',
      severity: 'warning' as const,
      confidence: 92.4,
      affectedArea: 'Lower canopy leaves (Rows 12-18)',
      treatment: 'Apply Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC. Prune bottom leaves to stop splash.',
      offlineMode: true,
      synced: !isOffline,
    },
    {
      id: 'scan-tomato-02',
      field: 'Farm A',
      crop: 'Tomato (Abhinav Hybrid)',
      timestamp: 'Yesterday, 04:15 PM',
      diagnosis: 'Healthy Foliage (No Leaf Curl / Blight)',
      severity: 'success' as const,
      confidence: 97.8,
      affectedArea: 'Upper apical shoot & flowers',
      treatment: 'Vigor score optimal. Maintain regular drip fertigation schedule.',
      offlineMode: true,
      synced: true,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Namaste greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('dashboard.overview')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {t('dashboard.greeting')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-3">
          <Badge
            variant={isOffline ? 'offline' : 'success'}
            size="lg"
            withDot
            className="shadow-2xs cursor-pointer py-1.5 px-3"
            onClick={toggleOfflineMode}
            title="Click to toggle offline simulation"
          >
            {isOffline ? t('common.offlineEdgeActive') : t('common.edgeConnected')}
          </Badge>
          <span className="text-xs text-slate-400 hidden md:inline">
            Telemetry Updated: <strong>{t('common.justNow')}</strong>
          </span>
        </div>
      </div>

      {/* 2. Current Field Highlight Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/40 shadow-xs overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <Sprout className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                    {t('dashboard.currentField')}
                  </span>
                  <span className="text-xs text-slate-500">• ID: FA-TOMATO-01</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {t('dashboard.farmName')}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-700">
                  <span className="text-emerald-900 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    {t('dashboard.cropType')} (Solanum lycopersicum)
                  </span>
                  <span className="text-slate-400">|</span>
                  <span>{t('dashboard.acreage')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 md:pt-0">
              <Link to="/analyze">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Scan className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
                >
                  {t('dashboard.analyzeCrop')}
                </Button>
              </Link>
              <Link to="/fields">
                <Button
                  variant="outline"
                  size="md"
                  className="text-xs"
                >
                  {t('dashboard.myFields')}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Five Telemetry Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Farm A Telemetry & Conditions</span>
          </h2>
          <span className="text-xs text-slate-400">Sensor & Visual Model Readings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Crop Health */}
          <Card className="hover:border-emerald-300 transition-all hover:shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('dashboard.cropHealth')}
                </span>
                <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <Activity className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">84%</span>
                  <Badge variant="warning" size="sm">Mild Stress</Badge>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full w-[84%]" />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Early blight spots flagged on lower foliage
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Temperature */}
          <Card className="hover:border-emerald-300 transition-all hover:shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('dashboard.temperature')}
                </span>
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
                  <Thermometer className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-900">28.5°C</span>
                  <span className="text-xs text-slate-500">Field ambient</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <Badge variant="success" size="sm">Optimal Range</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Day: 21°C min / 32°C max • Safe for flowers
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Humidity */}
          <Card className="hover:border-emerald-300 transition-all hover:shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('dashboard.humidity')}
                </span>
                <span className="p-1.5 rounded-xl bg-sky-100 text-sky-700">
                  <Droplets className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-900">62%</span>
                  <span className="text-xs text-slate-500">Relative (RH)</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <Badge variant="neutral" size="sm">Moderate</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Fungal spore threshold is &gt;75% • Safe bracket
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Soil Condition */}
          <Card className="hover:border-emerald-300 transition-all hover:shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('dashboard.soilCondition')}
                </span>
                <span className="p-1.5 rounded-xl bg-amber-800/10 text-amber-800">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-900">38%</span>
                  <span className="text-xs text-slate-500">Moisture</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <Badge variant="success" size="sm">{t('dashboard.soilMoistureStatus')}</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  pH: 6.8 • Drip line moisture is adequate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Online/Offline status */}
          <Card
            className={`transition-all hover:shadow-xs cursor-pointer ${
              isOffline
                ? 'border-stone-300 bg-stone-50/80'
                : 'border-emerald-200 bg-white'
            }`}
            onClick={toggleOfflineMode}
            title="Tap to toggle between Online and Simulated Offline Edge Mode"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('dashboard.onlineStatus')}
                </span>
                <span
                  className={`p-1.5 rounded-xl ${
                    isOffline
                      ? 'bg-stone-200 text-stone-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900">
                    {isOffline ? t('common.offline') : t('common.online')}
                  </span>
                  <Badge variant={isOffline ? 'offline' : 'success'} size="sm" withDot>
                    {isOffline ? 'Edge Mode' : 'Synced'}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  {isOffline
                    ? `${offlineQueueCount} scans in local queue • Tap to connect`
                    : 'Cloud sync active • Local inference ready'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Quick Actions (Analyze Crop, Voice Assistant, My Fields, Analysis History) */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          {t('dashboard.quickActions')}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Analyze Crop */}
          <Link to="/analyze" className="group block focus:outline-hidden">
            <Card
              variant="interactive"
              className="h-full p-4 sm:p-5 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-transparent hover:shadow-lg transition-all"
            >
              <div className="flex flex-col justify-between h-full space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                  <Scan className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {t('dashboard.analyzeCrop')}
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1 leading-snug">
                    Scan Tomato leaves on Farm A for stress and blight
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-100 pt-1 group-hover:text-white">
                  <span>Open Scanner</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Action 2: Voice Assistant */}
          <Link to="/assistant" className="group block focus:outline-hidden">
            <Card
              variant="interactive"
              className="h-full p-4 sm:p-5 border-slate-200 hover:border-teal-500 hover:shadow-md transition-all"
            >
              <div className="flex flex-col justify-between h-full space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-teal-700 transition-colors">
                    {t('dashboard.voiceAssistant')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Ask pesticide dosages & remedies in Hindi/English
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-teal-700 pt-1">
                  <span>Ask Agronomist</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Action 3: My Fields */}
          <Link to="/fields" className="group block focus:outline-hidden">
            <Card
              variant="interactive"
              className="h-full p-4 sm:p-5 border-slate-200 hover:border-amber-600 hover:shadow-md transition-all"
            >
              <div className="flex flex-col justify-between h-full space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-amber-800 transition-colors">
                    {t('dashboard.myFields')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Manage Farm A (2.5 acres) and other plot boundaries
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-800 pt-1">
                  <span>View All Plots</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Action 4: Analysis History */}
          <Link to="/history" className="group block focus:outline-hidden">
            <Card
              variant="interactive"
              className="h-full p-4 sm:p-5 border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="flex flex-col justify-between h-full space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-slate-900 transition-colors">
                    {t('dashboard.analysisHistory')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Chronological audit of tomato scans and spray actions
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 pt-1">
                  <span>Past Records</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* 5. Recent Crop Analysis Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('dashboard.recentCropAnalysis')}
            </h2>
            <p className="text-xs text-slate-500">
              Most recent on-device plant pathology scans for Farm A
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Scans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentAnalyses.map((analysis) => (
            <Card
              key={analysis.id}
              className={`transition-all hover:border-slate-300 ${
                analysis.severity === 'warning'
                  ? 'border-amber-200/90 bg-amber-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <CardContent className="p-5 space-y-3.5">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-2 rounded-xl shrink-0 ${
                        analysis.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {analysis.severity === 'warning' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">
                          {analysis.diagnosis}
                        </h3>
                        <Badge
                          variant={analysis.severity === 'warning' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {analysis.confidence}% Confidence
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {analysis.field} • {analysis.crop} • {analysis.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Badge variant={analysis.synced ? 'success' : 'offline'} size="sm" withDot>
                      {analysis.synced ? 'Synced' : 'Offline Stored'}
                    </Badge>
                  </div>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/70">
                    <span className="text-slate-400 block font-medium">Affected Area</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {analysis.affectedArea}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/70 md:col-span-2">
                    <span className="text-slate-400 block font-medium">Recommended Action</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block leading-relaxed">
                      {analysis.treatment}
                    </span>
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-slate-400">
                    Neural Engine: <strong>MobileNet-Tomato-v2 (INT8 quantized)</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <Link to="/assistant">
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-800 font-semibold">
                        Ask Advisor Treatment
                      </Button>
                    </Link>
                    <Link to="/analyze">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Scan Again
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. Spray Advisory Footer Strip for Farm A */}
      <Card className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Field Advisory for Farm A (Tomato)
              </h3>
              <p className="text-xs text-emerald-200 leading-snug">
                Relative humidity will reach 78% tomorrow morning. Complete early blight protective spray before 11:00 AM.
              </p>
            </div>
          </div>
          <Link to="/weather" className="shrink-0 w-full sm:w-auto">
            <Button
              variant="earth"
              size="sm"
              fullWidth
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold"
            >
              Spray Forecast
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
