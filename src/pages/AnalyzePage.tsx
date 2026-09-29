import React, { useState, useRef, useEffect } from 'react'
import {
  Scan,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  FileText,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Layers,
  Bug,
  Clock,
  Check,
  Loader2,
  X,
  Eye,
  SlidersHorizontal,
  HelpCircle,
  TrendingDown,
  ArrowRight,
  UserCheck,
  Send,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Modal } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'
import {
  analyzeCrop,
  saveAnalysisRecord,
  type CropType,
  type SoilCondition,
  type InsectsOption,
  type PlantsAffected,
  type SymptomsDuration,
  type DiagnosticScenario,
  type CropAnalysisResult,
  type WeatherData,
  type ImageQualityState,
  type ImageQualityReason,
  type ImageQualityInfo,
} from '../services/aiService'

// SVG illustrated leaf specimens with distinctive pathology for each crop
const SAMPLE_LEAF_IMAGES: Record<CropType, { label: string; diseaseName: string; svgData: string }> = {
  Tomato: {
    label: 'Tomato Leaf Sample',
    diseaseName: 'Early Blight (Alternaria solani)',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23064e3b" opacity="0.08"/>
      <path d="M200 40 C280 80 320 180 200 270 C80 180 120 80 200 40 Z" fill="%234ade80" stroke="%2316a34a" stroke-width="4"/>
      <path d="M200 40 L200 270 M160 110 L200 130 L240 100 M140 170 L200 190 L250 160 M170 230 L200 240 L230 220" stroke="%2315803d" stroke-width="3" stroke-linecap="round"/>
      <!-- Concentric Early Blight Target Rings -->
      <circle cx="160" cy="140" r="26" fill="%2378350f" stroke="%23eab308" stroke-width="3"/>
      <circle cx="160" cy="140" r="16" fill="%23451a03"/>
      <circle cx="160" cy="140" r="6" fill="%231c1917"/>
      <circle cx="230" cy="190" r="20" fill="%2378350f" stroke="%23eab308" stroke-width="2.5"/>
      <circle cx="230" cy="190" r="10" fill="%23451a03"/>
      <circle cx="180" cy="210" r="14" fill="%23854d0e" stroke="%23ca8a04" stroke-width="2"/>
      <text x="20" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2314532d">SPECIMEN: Solanum lycopersicum (Early Blight Concentric Rings)</text>
    </svg>`,
  },
  Rice: {
    label: 'Rice Paddy Blade Sample',
    diseaseName: 'Rice Blast (Magnaporthe oryzae)',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23064e3b" opacity="0.08"/>
      <path d="M190 20 C220 100 240 200 210 280 C180 280 160 180 170 20 Z" fill="%2386efac" stroke="%2316a34a" stroke-width="3"/>
      <line x1="185" y1="20" x2="195" y2="280" stroke="%2315803d" stroke-width="2.5"/>
      <!-- Spindle shaped blast lesions -->
      <path d="M180 110 Q195 90 200 110 Q195 130 180 110 Z" fill="%239a3412" stroke="%23ea580c" stroke-width="2"/>
      <path d="M175 160 Q192 135 205 160 Q192 185 175 160 Z" fill="%237c2d12" stroke="%23f97316" stroke-width="2.5"/>
      <ellipse cx="190" cy="160" rx="4" ry="7" fill="%23451a03"/>
      <text x="20" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2314532d">SPECIMEN: Oryza sativa (Spindle-shaped Blast Lesions)</text>
    </svg>`,
  },
  Wheat: {
    label: 'Wheat Flag Leaf Sample',
    diseaseName: 'Yellow Stripe Rust (Puccinia striiformis)',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23064e3b" opacity="0.08"/>
      <path d="M180 20 C230 90 240 220 200 280 C160 270 150 160 170 20 Z" fill="%23a7f3d0" stroke="%23059669" stroke-width="3"/>
      <line x1="185" y1="20" x2="188" y2="280" stroke="%23047857" stroke-width="2"/>
      <!-- Linear yellow-orange stripe rust pustules -->
      <line x1="175" y1="80" x2="178" y2="180" stroke="%23eab308" stroke-width="5" stroke-dasharray="8,4" stroke-linecap="round"/>
      <line x1="185" y1="100" x2="187" y2="230" stroke="%23f59e0b" stroke-width="6" stroke-dasharray="10,5" stroke-linecap="round"/>
      <line x1="195" y1="70" x2="198" y2="210" stroke="%23d97706" stroke-width="5" stroke-dasharray="9,4" stroke-linecap="round"/>
      <text x="20" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2314532d">SPECIMEN: Triticum aestivum (Linear Yellow Rust Pustules)</text>
    </svg>`,
  },
  Cotton: {
    label: 'Cotton Leaf Sample',
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23064e3b" opacity="0.08"/>
      <path d="M200 50 C240 40 280 90 270 130 C300 150 310 200 270 230 C240 260 160 260 130 230 C90 200 100 150 130 130 C120 90 160 40 200 50 Z" fill="%236ee7b7" stroke="%23059669" stroke-width="3"/>
      <!-- Curled thickened enation veins -->
      <path d="M200 50 Q210 160 200 250 M140 140 Q200 160 260 140 M120 210 Q200 200 270 210" stroke="%23047857" stroke-width="5" fill="none"/>
      <path d="M125 125 C115 140 115 160 130 150 Z" fill="%23bbf7d0" stroke="%23eab308" stroke-width="2"/>
      <path d="M275 125 C285 140 285 160 270 150 Z" fill="%23bbf7d0" stroke="%23eab308" stroke-width="2"/>
      <text x="20" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2314532d">SPECIMEN: Gossypium hirsutum (Upward Curling & Thickened Veins)</text>
    </svg>`,
  },
  Sugarcane: {
    label: 'Sugarcane Leaf Sample',
    diseaseName: 'Red Rot of Sugarcane (Colletotrichum falcatum)',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23064e3b" opacity="0.08"/>
      <path d="M200 15 C260 80 270 210 220 285 C160 285 140 180 180 15 Z" fill="%2386efac" stroke="%2315803d" stroke-width="3"/>
      <!-- Characteristic Red Rot streak along midrib -->
      <line x1="195" y1="20" x2="202" y2="280" stroke="%23b91c1c" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="200" cy="140" rx="9" ry="30" fill="%23991b1b"/>
      <ellipse cx="200" cy="140" rx="5" ry="12" fill="%23fef2f2"/>
      <text x="20" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2314532d">SPECIMEN: Saccharum officinarum (Red Midrib Lesion with White Center)</text>
    </svg>`,
  },
}

// 5 loading stages required by user
const ANALYSIS_STAGES = [
  'Processing image',
  'Detecting symptoms',
  'Checking field conditions',
  'Comparing weather',
  'Preparing recommendation',
]

// Local telemetry mock data
const LOCAL_WEATHER_DATA: WeatherData = {
  temperature: 28.5,
  humidity: 64,
  windSpeed: 8,
  rainfallProb: 15,
  recentRain: false,
}

export const AnalyzePage: React.FC = () => {
  const { showToast } = useToast()
  const { isOffline, t } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // 1. Crop selector state: Tomato, Rice, Wheat, Cotton, Sugarcane
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Tomato')

  // 2. Image state & preview
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_LEAF_IMAGES.Tomato.svgData)
  const [imageFileName, setImageFileName] = useState<string>('sample-specimen.svg')
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false)

  // 4. Field observation questions
  const [soilCondition, setSoilCondition] = useState<SoilCondition>('Normal')
  const [insectsPresent, setInsectsPresent] = useState<InsectsOption>('No')
  const [plantsAffected, setPlantsAffected] = useState<PlantsAffected>('Few')
  const [symptomsDuration, setSymptomsDuration] = useState<SymptomsDuration>('Few Days')

  // Image Quality state (Good / Poor with simulation reasons)
  const [qualityState, setQualityState] = useState<ImageQualityState>('good')
  const [selectedPoorReason, setSelectedPoorReason] = useState<ImageQualityReason>('Image blurry')

  // Review modal state & observations scroll ref
  const [isExpertModalOpen, setIsExpertModalOpen] = useState<boolean>(false)
  const [expertNote, setExpertNote] = useState<string>('')
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false)
  const observationsRef = useRef<HTMLDivElement>(null)

  // Diagnostic Scenario selection (supports auto evaluation and explicit test rules)
  const [selectedScenario, setSelectedScenario] = useState<DiagnosticScenario>('auto')

  // 7. Staged analysis loading animation
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0)
  const [analysisResult, setAnalysisResult] = useState<CropAnalysisResult | null>(null)
  const [latestScanId, setLatestScanId] = useState<string>('scan-latest')

  // Update sample leaf when crop changes (if not custom uploaded)
  const handleCropChange = (crop: CropType) => {
    setSelectedCrop(crop)
    if (!isCustomUpload) {
      setImagePreview(SAMPLE_LEAF_IMAGES[crop].svgData)
      setImageFileName(`${crop.toLowerCase()}-specimen.svg`)
    }
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setImageFileName(file.name)
      setIsCustomUpload(true)
      showToast({
        title: 'Image Selected',
        message: `${file.name} ready for diagnostic inference.`,
        type: 'info',
      })
    }
  }

  // Reset to sample leaf
  const handleResetToSample = () => {
    setImagePreview(SAMPLE_LEAF_IMAGES[selectedCrop].svgData)
    setImageFileName(`${selectedCrop.toLowerCase()}-specimen.svg`)
    setIsCustomUpload(false)
    setQualityState('good')
  }

  const handleRetakeImage = () => {
    setQualityState('good')
    setAnalysisResult(null)
    cameraInputRef.current?.click()
  }

  const handleProvideMoreInfo = () => {
    observationsRef.current?.scrollIntoView({ behavior: 'smooth' })
    showToast({
      title: 'Field Observations',
      message: 'Refine soil condition, insect presence, and symptoms duration below.',
      type: 'info',
    })
  }

  const handleRequestReview = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReview(true)
    setTimeout(() => {
      setIsSubmittingReview(false)
      setIsExpertModalOpen(false)
      setExpertNote('')
      showToast({
        title: 'Review Requested',
        message: 'Assessment submitted to District Agricultural Agronomist (KVK). Expect response in 2-4 hours.',
        type: 'success',
      })
    }, 1200)
  }

  // Trigger staged loading analysis
  const handleRunAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setCurrentStageIndex(0)
  }

  // Animate through all 5 stages
  useEffect(() => {
    if (!isAnalyzing) return

    if (currentStageIndex < ANALYSIS_STAGES.length) {
      const timer = setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1)
      }, 600)
      return () => clearTimeout(timer)
    } else {
      // Finished all 5 stages -> Call local mock AI service with imageQuality
      const imageQualityInfo: ImageQualityInfo = {
        state: qualityState,
        reasons: qualityState === 'poor' ? [selectedPoorReason] : [],
        goodChecks: ['Image quality is good', 'Crop is clearly visible'],
      }

      const res = analyzeCrop({
        crop: selectedCrop,
        soilCondition,
        insects: insectsPresent,
        affectedPlants: plantsAffected,
        symptomsDuration,
        weather: LOCAL_WEATHER_DATA,
        selectedScenario,
        imageBlobOrUrl: imagePreview,
        imageQuality: imageQualityInfo,
      })

      const scanId = `scan-${Date.now()}`
      saveAnalysisRecord({
        id: scanId,
        crop: selectedCrop,
        soilCondition,
        insects: insectsPresent,
        affectedPlants: plantsAffected,
        symptomsDuration,
        weather: LOCAL_WEATHER_DATA,
        imagePreview,
        result: res,
        createdAt: 'Just now',
      })

      setLatestScanId(scanId)
      setAnalysisResult(res)
      setIsAnalyzing(false)

      showToast({
        title: res.uncertainty.isUncertain ? 'Assessment Uncertain' : 'Analysis Complete',
        message: res.uncertainty.isUncertain
          ? 'Image quality or field inputs are insufficient for definitive diagnosis.'
          : isOffline
          ? 'Diagnosed via Local Edge Engine (Offline). Queued for sync.'
          : 'Diagnosed successfully with local micro-climate correlation.',
        type: res.uncertainty.isUncertain ? 'warning' : isOffline ? 'offline' : 'success',
      })
    }
  }, [
    isAnalyzing,
    currentStageIndex,
    isOffline,
    showToast,
    selectedCrop,
    soilCondition,
    insectsPresent,
    plantsAffected,
    symptomsDuration,
    selectedScenario,
    imagePreview,
    qualityState,
    selectedPoorReason,
  ])

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
          <Scan className="w-4 h-4" />
          <span>{t('analyze.engineTag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          {t('analyze.title')}
        </h1>
        <p className="text-sm text-slate-500">
          {t('analyze.subtitle')}
        </p>
      </div>

      {/* 1. Crop Selector (Tomato, Rice, Wheat, Cotton, Sugarcane) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>{t('analyze.selectCrop')}</span>
            </CardTitle>
            <Badge variant="neutral" size="sm">{t('analyze.supportedCrops')}</Badge>
          </div>
          <CardDescription className="text-xs">
            {t('analyze.cropSubtext')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(['Tomato', 'Rice', 'Wheat', 'Cotton', 'Sugarcane'] as CropType[]).map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => handleCropChange(crop)}
                className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                  selectedCrop === crop
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                }`}
              >
                <div className="text-sm leading-tight">{crop}</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {crop === 'Tomato' && 'Tamatar'}
                  {crop === 'Rice' && 'Dhan'}
                  {crop === 'Wheat' && 'Gehun'}
                  {crop === 'Cotton' && 'Kapas'}
                  {crop === 'Sugarcane' && 'Ganna'}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2 & 3. Image Upload/Camera UI & Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>{t('analyze.leafPhotograph')}</span>
            </CardTitle>
            {isCustomUpload ? (
              <Badge variant="success" size="sm">User Uploaded</Badge>
            ) : (
              <Badge variant="offline" size="sm">Standard Specimen</Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            {t('analyze.photoHint')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Image Preview Box */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900/5 aspect-video sm:aspect-21/9 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="Leaf symptom specimen"
              className={`w-full h-full object-contain max-h-72 p-2 transition-all duration-300 ${
                qualityState === 'poor' && selectedPoorReason === 'Image blurry'
                  ? 'blur-[4px]'
                  : qualityState === 'poor' && selectedPoorReason === 'Image too dark'
                  ? 'brightness-[0.22] contrast-150'
                  : qualityState === 'poor' && selectedPoorReason === 'Crop too small'
                  ? 'scale-[0.45]'
                  : ''
              }`}
            />

            {/* Diagnostic reticle overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/30 m-3 rounded-xl flex items-center justify-center">
              <div className="w-20 h-20 border border-dashed border-emerald-400/60 rounded-full" />
            </div>

            {/* Floating specimen badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedCrop} Specimen: {imageFileName}</span>
            </div>

            {/* Simulated poor quality warning pill */}
            {qualityState === 'poor' && (
              <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-md text-amber-950 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md animate-in fade-in duration-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-950" />
                <span>Simulating: {selectedPoorReason}</span>
              </div>
            )}

            {isCustomUpload && (
              <button
                type="button"
                onClick={handleResetToSample}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 p-1.5 rounded-lg shadow-md transition-colors cursor-pointer"
                title="Reset to sample specimen"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action buttons to upload or take camera picture */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Hidden native inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Camera className="w-4 h-4" />}
                onClick={() => cameraInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 min-h-[46px]"
              >
                {t('analyze.openCamera')}
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<UploadCloud className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[46px]"
              >
                {t('analyze.uploadImage')}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetToSample}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              {t('analyze.usePreset')}
            </Button>
          </div>

          {/* Pre-Scan Image Quality Checker */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              qualityState === 'good'
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/90 border-amber-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Image Quality Pre-Check:
                  </span>
                  <Badge variant={qualityState === 'good' ? 'success' : 'warning'} size="sm" withDot>
                    {qualityState === 'good' ? 'Good' : 'Poor Quality'}
                  </Badge>
                </div>

                {qualityState === 'good' ? (
                  <div className="space-y-1 text-xs text-emerald-950 font-medium pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>✓ Image quality is good</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>✓ Crop is clearly visible</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs text-amber-950 font-medium pt-0.5">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>⚠ Image quality is insufficient</span>
                    </div>
                    <div className="text-[11px] text-amber-800 pl-5">
                      Reason: <strong>{selectedPoorReason}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Simulation Controls */}
              <div className="flex flex-col gap-1.5 self-start sm:self-auto">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Simulate Image Quality (Demo):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQualityState('good')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      qualityState === 'good'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ✓ Good
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualityState('poor')
                      setSelectedPoorReason('Image blurry')
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      qualityState === 'poor' && selectedPoorReason === 'Image blurry'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Image blurry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualityState('poor')
                      setSelectedPoorReason('Image too dark')
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      qualityState === 'poor' && selectedPoorReason === 'Image too dark'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Image too dark
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualityState('poor')
                      setSelectedPoorReason('Crop too small')
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      qualityState === 'poor' && selectedPoorReason === 'Crop too small'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Crop too small
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Field Observation Questions */}
      <Card ref={observationsRef}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span>Field Observations</span>
          </CardTitle>
          <CardDescription className="text-xs">
            In-field observations improve diagnosis accuracy by correlating visual symptoms with soil & spread
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Question 1: Soil (Dry / Normal / Wet) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>Soil Moisture Condition:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Dry', 'Normal', 'Wet'] as SoilCondition[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSoilCondition(opt)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                    soilCondition === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Insects (Yes / No / Not Sure) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Bug className="w-3.5 h-3.5 text-rose-600" />
              <span>Insects / Pests Observed on Plant:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Yes', 'No', 'Not Sure'] as InsectsOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setInsectsPresent(opt)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                    insectsPresent === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Plants affected (Few / Many / Most) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Proportion of Plants Affected:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Few', 'Many', 'Most'] as PlantsAffected[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPlantsAffected(opt)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                    plantsAffected === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Symptoms duration (Today / Few Days / More than a Week) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Symptoms Duration:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Today', 'Few Days', 'More than a Week'] as SymptomsDuration[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSymptomsDuration(opt)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                    symptomsDuration === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Weather Context Card using local mock data */}
      <Card className="border-sky-200/80 bg-gradient-to-br from-sky-50/60 via-white to-emerald-50/40">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-sky-600" />
              <span>Local Weather Telemetry Context</span>
            </CardTitle>
            <Badge variant="offline" size="sm">Cached Offline (08:00 AM)</Badge>
          </div>
          <CardDescription className="text-xs">
            Micro-climate variables factored into disease development probabilities
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200/70">
              <span className="text-slate-400 block font-medium flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-amber-500" /> Temperature
              </span>
              <p className="text-base font-bold text-slate-900 mt-1">{LOCAL_WEATHER_DATA.temperature}°C</p>
              <span className="text-[10px] text-slate-500">Day high: 32°C</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/70">
              <span className="text-slate-400 block font-medium flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-500" /> Humidity
              </span>
              <p className="text-base font-bold text-slate-900 mt-1">{LOCAL_WEATHER_DATA.humidity}% RH</p>
              <span className="text-[10px] text-slate-500">Spore risk: Moderate</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/70">
              <span className="text-slate-400 block font-medium flex items-center gap-1">
                <Wind className="w-3 h-3 text-teal-500" /> Wind Speed
              </span>
              <p className="text-base font-bold text-slate-900 mt-1">{LOCAL_WEATHER_DATA.windSpeed} km/h</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Safe spray drift</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/70">
              <span className="text-slate-400 block font-medium flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-amber-500" /> Rain Probability
              </span>
              <p className="text-base font-bold text-slate-900 mt-1">{LOCAL_WEATHER_DATA.rainfallProb}%</p>
              <span className="text-[10px] text-slate-500">Rain-free window</span>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-sky-50/80 border border-sky-100 text-[11px] text-sky-950 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Micro-climate impact:</strong> Moderate humidity ({LOCAL_WEATHER_DATA.humidity}%) and mild {LOCAL_WEATHER_DATA.windSpeed} km/h wind provide an optimal foliar spraying window prior to 11:30 AM today.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Demo Scenario Preset Switcher (Prototype Testing Bar) */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Rule Calibration & Demo Scenarios:</span>
          </span>
          <span className="text-[11px] text-slate-400">Prototype Demo Mode</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
          {[
            { id: 'auto', label: 'Auto (Inputs)' },
            { id: 'fungal_stress', label: 'Fungal Blight' },
            { id: 'water_stress', label: 'Water Stress' },
            { id: 'pest_attack', label: 'Pest Attack' },
            { id: 'uncertain_low_confidence', label: 'Uncertain (<70%)' },
          ].map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedScenario(sc.id as DiagnosticScenario)}
              className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all cursor-pointer ${
                selectedScenario === sc.id
                  ? 'bg-slate-900 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Analyze Crop Button */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          disabled={isAnalyzing}
          onClick={handleRunAnalysis}
          leftIcon={
            isAnalyzing ? (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            ) : (
              <Sparkles className="w-6 h-6 text-amber-300" />
            )
          }
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-700/20 active:scale-[0.99] min-h-[58px]"
        >
          {isAnalyzing ? 'Running Multimodal Analysis...' : `Analyze ${selectedCrop} Crop Now`}
        </Button>
      </div>

      {/* 7. Analysis Loading Animation with the 5 Required Stages */}
      {isAnalyzing && (
        <Card className="border-emerald-300 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          <CardHeader className="bg-emerald-50/80 border-b border-emerald-100 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                <span>On-Device Inference Pipeline Active</span>
              </CardTitle>
              <Badge variant="success" size="sm">
                Stage {Math.min(currentStageIndex + 1, ANALYSIS_STAGES.length)} of {ANALYSIS_STAGES.length}
              </Badge>
            </div>
            <CardDescription className="text-xs text-emerald-800">
              Processing quantized neural weights with local field and telemetry context
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Visual progress track */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentStageIndex + 1) / ANALYSIS_STAGES.length) * 100}%`,
                }}
              />
            </div>

            {/* List of 5 Stages */}
            <div className="space-y-2.5 pt-1">
              {ANALYSIS_STAGES.map((stageName, idx) => {
                const isPast = idx < currentStageIndex
                const isCurrent = idx === currentStageIndex
                const isFuture = idx > currentStageIndex

                return (
                  <div
                    key={stageName}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : isPast
                        ? 'border-slate-200 bg-slate-50/80 text-slate-700 font-medium'
                        : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                          isPast
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isPast ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <span className="text-sm font-medium">
                        {stageName}
                      </span>
                    </div>

                    <div>
                      {isPast && (
                        <span className="text-[11px] text-emerald-700 font-semibold">Done</span>
                      )}
                      {isCurrent && (
                        <span className="text-[11px] text-emerald-800 font-bold animate-pulse">Running...</span>
                      )}
                      {isFuture && (
                        <span className="text-[11px] text-slate-400">Waiting</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 8. Analysis Result Card (rendered using aiService response) */}
      {analysisResult && !isAnalyzing && (
        analysisResult.uncertainty.isUncertain ? (
          /* Dedicated Uncertain AI Result Card */
          <Card className="border-2 border-amber-400 bg-gradient-to-b from-white via-amber-50/20 to-amber-50/40 shadow-xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-amber-50/90 border-b border-amber-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                    <HelpCircle className="w-7 h-7 text-amber-700" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl sm:text-2xl font-black text-slate-900">
                        Assessment Uncertain
                      </CardTitle>
                      <Badge variant="warning" size="md">
                        Assessment Uncertain
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-amber-950 mt-0.5 font-medium">
                      Target Crop: <strong>{selectedCrop}</strong> • Model Confidence: <strong>{analysisResult.confidence}%</strong> (Inconclusive)
                    </CardDescription>
                  </div>
                </div>

                <Badge variant="offline" size="md">
                  Inference Latency: {analysisResult.modelMetadata.latencyMs} ms ({analysisResult.modelMetadata.engine})
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-6">
              {/* Mandatory Requirement: Insufficient information message */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-2 border-amber-300 text-amber-950 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>Uncertain Assessment Notice</span>
                </div>
                <p className="text-sm sm:text-base text-amber-950 font-bold leading-relaxed">
                  "The available image and field information are insufficient to reliably distinguish the cause."
                </p>
                <div className="text-xs text-amber-900 pt-1 border-t border-amber-200/80 flex items-center gap-2">
                  <span className="font-semibold">Reason detected:</span>
                  <span>{analysisResult.uncertainty.reason || 'Image quality or field indicators below confidence threshold.'}</span>
                </div>
              </div>

              {/* Confidence values for multiple possible causes:
                  Disease 42%
                  Nutrient stress 35%
                  Water stress 23%
              */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Confidence Values for Multiple Possible Causes:
                  </h4>
                  <span className="text-xs text-amber-700 font-semibold">Differential Analysis</span>
                </div>

                <div className="space-y-2.5">
                  {analysisResult.possibleCauses.map((pc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs hover:border-amber-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm sm:text-base font-semibold">
                        <span className="text-slate-900 font-bold">
                          {pc.cause} {pc.probability}%
                        </span>
                        <span className="font-mono font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm">
                          {pc.probability}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-700 ${
                            idx === 0
                              ? 'bg-amber-600'
                              : idx === 1
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                          style={{ width: `${pc.probability}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{pc.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Requirement 3 Buttons:
                  Retake Image
                  Provide More Information
                  Request Expert Review
              */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Required Next Steps:
                  </span>
                  <span className="text-xs text-slate-500">Select an action</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Camera className="w-4 h-4" />}
                    onClick={handleRetakeImage}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold min-h-[48px] shadow-xs"
                  >
                    Retake Image
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                    onClick={handleProvideMoreInfo}
                    className="font-bold border-slate-300 hover:bg-slate-100 text-slate-800 min-h-[48px] shadow-xs"
                  >
                    Provide More Information
                  </Button>

                  <Button
                    variant="earth"
                    size="lg"
                    leftIcon={<UserCheck className="w-4 h-4" />}
                    onClick={() => setIsExpertModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold min-h-[48px] shadow-xs"
                  >
                    Request Expert Review
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 p-4">
              <span className="text-xs text-slate-500">Specimen: {imageFileName} • {analysisResult.diagnosedAt}</span>
              <div className="flex items-center gap-2">
                <Link to={`/result/${latestScanId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Full Evidence Details
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ) : (
          /* Standard High Confidence Result Card */
          <Card
            className={`shadow-xl animate-in slide-in-from-bottom-4 duration-300 ${
              analysisResult.overallStatus === 'High Stress' || analysisResult.overallStatus === 'Critical Risk'
                ? 'border-rose-300 bg-gradient-to-b from-white to-rose-50/20'
                : 'border-emerald-300 bg-gradient-to-b from-white to-emerald-50/20'
            }`}
          >
            {/* Header */}
            <CardHeader className="border-b border-slate-200/80 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-2.5 rounded-xl ${
                      analysisResult.overallStatus === 'Critical Risk' || analysisResult.overallStatus === 'High Stress'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {analysisResult.overallStatus === 'Critical Risk' || analysisResult.overallStatus === 'High Stress' ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl text-slate-900">
                        {analysisResult.primaryCause}
                      </CardTitle>
                      <Badge
                        variant={
                          analysisResult.overallStatus === 'Critical Risk' || analysisResult.overallStatus === 'High Stress'
                            ? 'danger'
                            : 'success'
                        }
                        size="sm"
                      >
                        {analysisResult.overallStatus}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Target Crop: <strong>{selectedCrop}</strong> • Model Confidence: <strong>{analysisResult.confidence}%</strong>
                    </CardDescription>
                  </div>
                </div>

                <Badge variant="offline" size="md">
                  Inference Latency: {analysisResult.modelMetadata.latencyMs} ms ({analysisResult.modelMetadata.engine})
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* Possible Causes Probabilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Differential Diagnostic Probabilities:
                </h4>
                <div className="space-y-2">
                  {analysisResult.possibleCauses.map((pc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-900">{pc.cause}</span>
                        <span className="text-emerald-700 font-bold">{pc.probability}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(pc.probability, 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{pc.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Diagnostic Corroboration & Evidence:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysisResult.evidence.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations Plan */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-amber-50/50 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-950 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Field Advisory Action Plan:</span>
                </h4>

                {/* Chemical Spray */}
                {analysisResult.recommendations.chemicalSpray && (
                  <div className="text-xs sm:text-sm text-slate-800">
                    <span className="font-bold text-slate-900 block">Recommended Intervention:</span>
                    <p className="mt-0.5 leading-relaxed text-slate-700">
                      {analysisResult.recommendations.chemicalSpray}
                    </p>
                  </div>
                )}

                {/* Organic Alternative */}
                {analysisResult.recommendations.organicAlternative && (
                  <div className="text-xs sm:text-sm text-slate-800 pt-1">
                    <span className="font-bold text-emerald-900 block">Organic / Bio-Alternative:</span>
                    <p className="mt-0.5 leading-relaxed text-slate-700">
                      {analysisResult.recommendations.organicAlternative}
                    </p>
                  </div>
                )}

                {/* Spray Window Timing */}
                {analysisResult.recommendations.sprayTimingWindow && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/80 border border-emerald-200 text-xs text-slate-800">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{analysisResult.recommendations.sprayTimingWindow}</span>
                  </div>
                )}

                {/* Immediate & Preventive Actions */}
                <div className="pt-1 space-y-1 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block">Cultural & Preventive Measures:</span>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {analysisResult.recommendations.preventiveMeasures.map((pm, idx) => (
                      <li key={idx}>{pm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 p-4">
              <span className="text-xs text-slate-500">Specimen: {imageFileName} • {analysisResult.diagnosedAt}</span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FileText className="w-4 h-4" />}
                  onClick={() =>
                    showToast({
                      title: 'Report Exported',
                      message: `Diagnostic PDF for ${selectedCrop} saved to device.`,
                      type: 'info',
                    })
                  }
                >
                  Export PDF
                </Button>
                <Link to={`/result/${latestScanId}`}>
                  <Button
                    variant="earth"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    Full Assessment & Evidence
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        )
      )}

      {/* Expert Review Modal */}
      <Modal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
        title="Request Expert Review (KVK Agronomist)"
        description="Submit this diagnostic record to the Krishi Vigyan Kendra extension team for manual verification"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmittingReview}
              onClick={handleRequestReview}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit to Agronomist
            </Button>
          </>
        }
      >
        <form onSubmit={handleRequestReview} className="space-y-4 py-2 text-xs sm:text-sm text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-800 block text-xs">Crop & Diagnostic Status:</span>
            <span className="text-slate-900 font-bold block mt-0.5">
              {selectedCrop} • {analysisResult?.primaryCause || 'Assessment Uncertain'} ({analysisResult?.confidence || 42}% Confidence)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Add Specific Note for Extension Officer (Optional):
            </label>
            <textarea
              rows={3}
              value={expertNote}
              onChange={(e) => setExpertNote(e.target.value)}
              placeholder="e.g. Symptoms intensified after rain; leaf shows yellowing but camera could not focus sharply..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
            <strong>Offline Queue:</strong> If you are currently in a cellular dead zone, this request will be stored locally and queued for dispatch upon re-connection.
          </div>
        </form>
      </Modal>
    </div>
  )
}
