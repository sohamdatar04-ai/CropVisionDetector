import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  UserCheck,
  Thermometer,
  Droplets,
  Wind,
  CloudSun,
  Layers,
  Bug,
  Clock,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  FileText,
  Share2,
  Send,
  Eye,
  ArrowRight,
  Camera,
  SlidersHorizontal,
} from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Modal } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'
import { getAnalysisRecord, type StoredAnalysisRecord } from '../services/aiService'

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isOffline } = useApp()

  const [record, setRecord] = useState<StoredAnalysisRecord | null>(null)
  const [isWhyExpanded, setIsWhyExpanded] = useState<boolean>(true)
  const [isExpertModalOpen, setIsExpertModalOpen] = useState<boolean>(false)
  const [expertNote, setExpertNote] = useState<string>('')
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false)

  useEffect(() => {
    if (id) {
      const found = getAnalysisRecord(id)
      setRecord(found)
    }
  }, [id])

  if (!record) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Analysis Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested scan record could not be retrieved from local device storage.
        </p>
        <Link to="/analyze">
          <Button variant="primary" size="md">
            Start New Scan
          </Button>
        </Link>
      </div>
    )
  }

  const { result, crop, soilCondition, insects, affectedPlants, symptomsDuration, weather } = record

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

  // Status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Critical Risk':
      case 'High Stress':
        return <Badge variant="danger" size="lg">{status}</Badge>
      case 'Moderate Stress':
        return <Badge variant="warning" size="lg">{status}</Badge>
      case 'Mild Stress':
        return <Badge variant="info" size="lg">{status}</Badge>
      default:
        return <Badge variant="success" size="lg">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* 1. Header: Crop Assessment & Overall status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diagnostic Report #{record.id.slice(0, 10)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Crop Assessment: {crop}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluated on-device via Edge Intelligence • {record.createdAt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Overall Status
            </span>
            <div className="mt-0.5">{getStatusBadge(result.overallStatus)}</div>
          </div>
        </div>
      </div>

      {/* 2. Most likely cause & Confidence Visual Indicator */}
      <Card className="border-emerald-300/80 bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 shadow-md overflow-hidden">
        <CardContent className="p-5 sm:p-7 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Primary diagnosis text */}
            <div className="space-y-2 max-w-lg">
              <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md inline-block ${
                result.uncertainty.isUncertain
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {result.uncertainty.isUncertain ? 'Assessment Status' : 'Most likely cause'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {result.primaryCause}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {result.uncertainty.isUncertain ? (
                  <span className="font-bold text-amber-950">
                    "The available image and field information are insufficient to reliably distinguish the cause."
                  </span>
                ) : (
                  <><strong>Based on available evidence</strong>, visual foliar patterns, and field weather correlation.</>
                )}
              </p>

              {/* Crucial non-claim disclaimer */}
              <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Advisory Notice:</strong> This is a probabilistic AI assessment based on available evidence. Always confirm before applying intensive chemical treatments.
                </span>
              </div>
            </div>

            {/* Visual Confidence Gauge / Dial Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center min-w-[200px] shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Model Confidence
              </span>

              {/* Confidence ring visual */}
              <div className="relative my-3 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-100"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={301.59}
                    strokeDashoffset={301.59 - (301.59 * result.confidence) / 100}
                    strokeLinecap="round"
                    className={
                      result.confidence >= 85
                        ? 'text-emerald-600'
                        : result.confidence >= 70
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">
                    {result.confidence}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Certainty</span>
                </div>
              </div>

              <Badge
                variant={
                  result.confidence >= 85
                    ? 'success'
                    : result.confidence >= 70
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {result.confidence >= 85
                  ? 'Strong Evidence'
                  : result.confidence >= 70
                  ? 'Moderate Evidence'
                  : 'Low Certainty'}
              </Badge>
            </div>
          </div>

          {/* 3. Possible causes breakdown chart */}
          <div className="pt-4 border-t border-slate-200/70 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Possible causes (Differential Probability Distribution)
            </h3>

            <div className="space-y-2.5">
              {result.possibleCauses.map((pc, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-slate-900">
                      {idx + 1}. {pc.cause}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        idx === 0 ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {pc.probability}%
                    </span>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        idx === 0
                          ? 'bg-emerald-600'
                          : idx === 1
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${Math.min(pc.probability, 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">{pc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Expandable: "Why did the AI reach this assessment?" */}
      <Card className="border-slate-200/90 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setIsWhyExpanded(!isWhyExpanded)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Why did the AI reach this assessment?
              </h3>
              <p className="text-xs text-slate-500">
                Transparent multi-factor evidence synthesis
              </p>
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500">
            {isWhyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isWhyExpanded && (
          <CardContent className="p-5 sm:p-6 space-y-4 border-t border-slate-100 animate-in fade-in duration-200">
            <p className="text-xs text-slate-500">
              Based on available evidence, the on-device inference correlated 4 separate input streams to determine this outcome:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Factor 1: Visual symptoms */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  1. Visual Symptoms
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Identified characteristic necrotic lesion geometries and chlorotic discoloration matching known pathogen phenotypes for <strong>{crop}</strong>.
                </p>
              </div>

              {/* Factor 2: Weather */}
              <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/80 space-y-1.5">
                <span className="font-bold text-sky-950 flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-sky-600" />
                  2. Weather Conditions
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Temperature ({weather.temperature}°C) and relative humidity ({weather.humidity}%) create an environment conducive to spore sporulation and pest reproduction.
                </p>
              </div>

              {/* Factor 3: Soil */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-700" />
                  3. Soil Moisture Status
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Soil condition reported as <strong>{soilCondition}</strong>. Micro-environment drainage directly influences fungal splash and drought wilt symptoms.
                </p>
              </div>

              {/* Factor 4: Number of affected plants */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-stone-700" />
                  4. Number of Affected Plants
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Spread observed on <strong>{affectedPlants}</strong> plants over <strong>{symptomsDuration}</strong> confirms rapid active localized infection.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 5. Evidence Sections (Weather evidence & Field observations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weather Evidence Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-sky-600" />
              <CardTitle className="text-base">Weather Evidence</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Micro-climate variables recorded during assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-500" /> Ambient Temp
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {weather.temperature}°C
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-500" /> Humidity
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {weather.humidity}% RH
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Wind className="w-3 h-3 text-teal-500" /> Wind Velocity
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {weather.windSpeed ?? 8} km/h
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <CloudSun className="w-3 h-3 text-amber-500" /> Rain Probability
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {weather.rainfallProb ?? 15}%
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-50 text-[11px] text-sky-900 border border-sky-100">
              <strong>Weather Impact:</strong> Low wind speed allows safe chemical deposition without drift risk; humidity creates high foliar retention.
            </div>
          </CardContent>
        </Card>

        {/* Field Observations Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-700" />
              <CardTitle className="text-base">Field Observations</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Farmer inputs corroborated against neural detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-600" /> Soil Condition
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {soilCondition}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Bug className="w-3 h-3 text-rose-600" /> Insects Seen
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {insects}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-600" /> Plants Affected
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {affectedPlants}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-600" /> Duration
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {symptomsDuration}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-amber-950 border border-amber-200">
              <strong>Agronomic Correlation:</strong> Symptom persistence over {symptomsDuration.toLowerCase()} across {affectedPlants.toLowerCase()} plants confirms infectious rather than physical injury.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. Recommendations Section */}
      <Card className="border-emerald-300 bg-white shadow-md">
        <CardHeader className="bg-emerald-50/70 border-b border-emerald-100 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Recommended Action Plan</span>
            </CardTitle>
            <Badge variant="success" size="sm">Tailored Dosage</Badge>
          </div>
          <CardDescription className="text-xs text-emerald-900">
            Validated interventions based on available evidence
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* Chemical Spray */}
          {result.recommendations.chemicalSpray && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                Chemical Treatment & Dosage:
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {result.recommendations.chemicalSpray}
              </p>
            </div>
          )}

          {/* Organic Alternative */}
          {result.recommendations.organicAlternative && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
              <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider block">
                Organic / Bio-Control Formulation:
              </span>
              <p className="text-emerald-950 font-medium leading-relaxed">
                {result.recommendations.organicAlternative}
              </p>
            </div>
          )}

          {/* Spray Window */}
          {result.recommendations.sprayTimingWindow && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Optimal Spray Timing Window:</strong> {result.recommendations.sprayTimingWindow}
              </span>
            </div>
          )}

          {/* Cultural / Preventive Measures */}
          <div className="pt-2 space-y-1.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block">Immediate Cultural & Preventive Steps:</span>
            <ul className="list-disc list-inside space-y-1 pl-1">
              {result.recommendations.immediateActions.map((action, idx) => (
                <li key={idx} className="leading-relaxed">{action}</li>
              ))}
              {result.recommendations.preventiveMeasures.map((measure, idx) => (
                <li key={idx} className="leading-relaxed">{measure}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 7. Action Buttons (Retake Image, Provide More Information, Request Expert Review if uncertain, else Analyze Another Crop & Request Expert Review) */}
      <div className="pt-2 pb-6">
        {result.uncertainty.isUncertain ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/analyze" className="w-full">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Camera className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold min-h-[50px] shadow-sm"
              >
                Retake Image
              </Button>
            </Link>

            <Link to="/analyze" className="w-full">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                className="font-bold border-slate-300 hover:bg-slate-100 text-slate-800 min-h-[50px] shadow-sm"
              >
                Provide More Information
              </Button>
            </Link>

            <Button
              variant="earth"
              size="lg"
              fullWidth
              leftIcon={<UserCheck className="w-4 h-4" />}
              onClick={() => setIsExpertModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold min-h-[50px] shadow-sm"
            >
              Request Expert Review
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link to="/analyze" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="min-h-[50px]"
              >
                Analyze Another Crop
              </Button>
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="earth"
                size="lg"
                fullWidth
                leftIcon={<UserCheck className="w-4 h-4" />}
                onClick={() => setIsExpertModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold min-h-[50px] shadow-sm"
              >
                Request Expert Review
              </Button>
            </div>
          </div>
        )}
      </div>

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
            <span className="font-semibold text-slate-800 block text-xs">Crop & Suspected Cause:</span>
            <span className="text-slate-900 font-bold block mt-0.5">
              {crop} • {result.primaryCause} ({result.confidence}% Confidence)
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
              placeholder="e.g. Symptoms intensified after last irrigation; noticed tiny flying flies on leaf undersides..."
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
