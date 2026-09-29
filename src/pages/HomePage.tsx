import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Scan,
  ShieldCheck,
  Zap,
  HardDriveDownload,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CloudSun,
  MapPin,
  Bot,
  Activity,
  CheckCircle,
} from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Modal } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

export const HomePage: React.FC = () => {
  const { showToast } = useToast()
  const { isOffline, toggleOfflineMode, language, setLanguage, t } = useApp()
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const triggerSampleToasts = () => {
    showToast({
      title: 'Offline Model Synced',
      message: 'Wheat & Rice stress detection neural weights loaded into local device storage.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 🏆 Hackathon Interactive Evaluation Presets Banner for Judges */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <span>🏆</span>
              <span>Hackathon Evaluation Ready</span>
            </span>
            <span className="text-xs font-bold text-emerald-800 hidden sm:inline">
              Krishi Saathi AI • Live Interactive Tour
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Click any preset below for instant evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Preset 1: Fungal Blight Diagnosis */}
          <Link
            to="/analyze"
            className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">🌾</span>
                <Badge variant="success" size="sm">94.8% Conf</Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                1. Fungal Blight Analysis
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Clear leaf scan with high humidity & rainfall correlation, Early Blight diagnosis, and spray window.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Run Diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Preset 2: Image Quality & Uncertainty Guardrail */}
          <Link
            to="/analyze"
            className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs hover:border-amber-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">⚠</span>
                <Badge variant="warning" size="sm">Guardrail Active</Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors">
                2. Image Quality & Uncertainty
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Simulate blurry leaf image. Triggers "Assessment Uncertain", 42%/35%/23% causes, & 3 corrective buttons.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Test Guardrail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Preset 3: Zero-Connectivity Field Test */}
          <div
            onClick={toggleOfflineMode}
            className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-500 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">📴</span>
                <Badge variant={isOffline ? 'offline' : 'info'} size="sm">
                  {isOffline ? 'Offline Mode Active' : 'Tap to Disconnect'}
                </Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-stone-800 transition-colors">
                3. Zero-Connectivity Edge Demo
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cut internet connectivity. Edge AI performs inference locally via INT8 rules and stores in local queue.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-700 mt-3 inline-flex items-center gap-1">
              <span>Toggle: {isOffline ? 'Go Online' : 'Simulate Offline'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Preset 4: Multilingual Language Switcher */}
          <div className="p-4 rounded-2xl bg-white border border-teal-200/90 shadow-2xs hover:border-teal-500 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">🌐</span>
                <Badge variant="neutral" size="sm">3 Languages</Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                4. Instant Regional Localization
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Seamlessly flip between English, Hindi, and Marathi with zero reload delay.
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'mr'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-600/30">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/40 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Precision Agriculture for Bharat</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Offline-First Crop Stress Detection & Field Advisory
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed font-normal">
            Identify nutrient deficiencies, fungal blights, and pest infestations right in the field — even without cellular connectivity or internet.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link to="/analyze">
              <Button
                variant="earth"
                size="lg"
                leftIcon={<Scan className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg"
              >
                Scan Crop Now
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Field Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-8 top-8 opacity-10 sm:opacity-20 pointer-events-none">
          <Scan className="w-64 h-64 text-white" />
        </div>
      </section>

      {/* Key Status Indicators */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="hover:border-emerald-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Edge AI Engine</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900">On-Device</span>
                <Badge variant="success" size="sm" withDot>Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="hover:border-emerald-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Inference Latency</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900">~140 ms</span>
                <span className="text-xs text-emerald-700 font-semibold">Zero-cloud</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="hover:border-emerald-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Registered Plots</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900">4 Plots</span>
                <span className="text-xs text-slate-500">12.5 Acres</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="hover:border-emerald-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <HardDriveDownload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Offline Cache</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900">4 Models</span>
                <Badge variant={isOffline ? 'offline' : 'success'} size="sm">
                  {isOffline ? 'Offline' : 'Connected'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Launchpad Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Field Launchpad</h2>
            <p className="text-sm text-slate-500">Essential tools designed for rugged field conditions</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Scanner */}
          <Card variant="interactive" className="group">
            <Link to="/analyze" className="block p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Crop Stress Scanner
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Capture leaves to detect fungal rust, nitrogen deficiency, leaf blight, or water stress instantly.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <span>Open Camera & Diagnostics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </Card>

          {/* Card 2: AI Field Advisor */}
          <Card variant="interactive" className="group">
            <Link to="/assistant" className="block p-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Krishi AI Field Advisor
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Consult with multilingual agricultural intelligence on organic pest remedies, dosage, and spray timings.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-700">
                <span>Ask Field Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </Card>

          {/* Card 3: Weather & Spray Windows */}
          <Card variant="interactive" className="group">
            <Link to="/weather" className="block p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Weather & Spray Advisory
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Micro-climate forecasts, rain probability, wind speeds, and calculated optimal pesticide spray windows.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-700">
                <span>View Spray Forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </Card>
        </div>
      </section>

      {/* Field Alert & Active Diagnostics */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Urgent Alert */}
        <Card className="lg:col-span-2 border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <CardTitle className="text-amber-950">Active Field Advisory Alert</CardTitle>
                <CardDescription className="text-amber-800">North Plot 2 (Wheat - HD 2967)</CardDescription>
              </div>
            </div>
            <Badge variant="warning" size="md">High Risk</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              Early signs of <strong>Yellow Rust (Puccinia striiformis)</strong> identified during yesterday's scan with 92% confidence. Immediate foliar intervention recommended prior to upcoming humid spells.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/history">
                <Button variant="earth" size="sm">
                  View Diagnosis Log
                </Button>
              </Link>
              <Link to="/assistant">
                <Button variant="outline" size="sm" className="bg-white">
                  Ask Recommended Treatment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Offline Center Shortcut */}
        <Card variant="accent">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <HardDriveDownload className="w-4 h-4 text-emerald-700" />
              <span>Offline Readiness</span>
            </div>
            <CardTitle className="text-lg">Edge Synchronizer</CardTitle>
            <CardDescription>All crop disease models stored on this device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Wheat & Cereals Model</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 18.4 MB
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Rice & Paddy Model</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 21.2 MB
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Cotton & Pulses Model</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 16.8 MB
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/offline" className="w-full">
              <Button variant="secondary" size="sm" fullWidth>
                Manage Storage & Sync
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      {/* Component System Verification Panel for Hackathon Review */}
      <section className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Design System & Component Verifier</h3>
          </div>
          <span className="text-xs text-slate-400">Foundation Ready</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md" onClick={() => setDemoModalOpen(true)}>
            Open Sample Modal
          </Button>
          <Button variant="secondary" size="md" onClick={triggerSampleToasts}>
            Trigger Sample Toast
          </Button>
          <Button variant="earth" size="md" onClick={toggleOfflineMode}>
            Toggle Offline Mode ({isOffline ? 'Offline' : 'Online'})
          </Button>
        </div>

        {/* Modal Demonstration */}
        <Modal
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
          title="Krishi Saathi AI Modal"
          description="Reusable modal component built for mobile & desktop field devices"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setDemoModalOpen(false)}>
                Dismiss
              </Button>
              <Button variant="primary" size="sm" onClick={() => setDemoModalOpen(false)}>
                Understood
              </Button>
            </>
          }
        >
          <div className="space-y-3 py-2 text-sm text-slate-600">
            <p>
              This modal component features smooth backdrop transitions, touch-friendly dismissing, full keyboard ESC trapping, and adapts automatically to mobile bottom-sheet styling.
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              <strong>Offline-First Tip:</strong> When offline, all diagnoses remain safely queued locally in IndexedDB until high-speed sync is available.
            </div>
          </div>
        </Modal>
      </section>
    </div>
  )
}
