/**
 * Krishi Saathi AI - Local Edge Diagnostic Service (Mock AI Engine)
 *
 * Designed with a clean decoupled interface so it can seamlessly be swapped
 * with an on-device ONNX runtime / quantized YOLOv8 / MobileNet model later.
 */

export type CropType = 'Tomato' | 'Rice' | 'Wheat' | 'Cotton' | 'Sugarcane'
export type SoilCondition = 'Dry' | 'Normal' | 'Wet'
export type InsectsOption = 'Yes' | 'No' | 'Not Sure'
export type PlantsAffected = 'Few' | 'Many' | 'Most'
export type SymptomsDuration = 'Today' | 'Few Days' | 'More than a Week'

export type DiagnosticScenario =
  | 'auto'
  | 'fungal_stress'
  | 'water_stress'
  | 'pest_attack'
  | 'nutrient_deficiency'
  | 'uncertain_low_confidence'

export interface WeatherData {
  temperature: number
  humidity: number
  rainfallProb?: number
  windSpeed?: number
  condition?: string
  recentRain?: boolean
}

export type ImageQualityState = 'good' | 'poor'
export type ImageQualityReason = 'Image blurry' | 'Image too dark' | 'Crop too small'

export interface ImageQualityInfo {
  state: ImageQualityState
  reasons: ImageQualityReason[]
  goodChecks: string[]
}

export interface CropAnalysisInput {
  crop: CropType
  soilCondition: SoilCondition
  insects: InsectsOption
  affectedPlants: PlantsAffected
  symptomsDuration?: SymptomsDuration
  weather: WeatherData
  selectedScenario?: DiagnosticScenario
  imageBlobOrUrl?: string
  imageQuality?: ImageQualityInfo
}

export interface PossibleCause {
  cause: string
  probability: number
  description: string
}

export interface RecommendationPlan {
  immediateActions: string[]
  chemicalSpray?: string
  organicAlternative?: string
  sprayTimingWindow?: string
  preventiveMeasures: string[]
}

export interface UncertaintyAssessment {
  isUncertain: boolean
  confidenceScore: number
  message?: string
  reason?: string
  suggestedNextStep?: string
}

export interface CropAnalysisResult {
  overallStatus: 'Assessment Uncertain' | 'Healthy' | 'Mild Stress' | 'Moderate Stress' | 'High Stress' | 'Critical Risk'
  primaryCause: string
  confidence: number
  possibleCauses: PossibleCause[]
  evidence: string[]
  recommendations: RecommendationPlan
  uncertainty: UncertaintyAssessment
  diagnosedAt: string
  modelMetadata: {
    engine: string
    latencyMs: number
    offlineProcessed: boolean
  }
}

/**
 * Analyzes crop health, foliar imagery, and field observations
 * using deterministic agronomic rules calibrated for Indian agricultural ecologies.
 */
export function analyzeCrop(input: CropAnalysisInput): CropAnalysisResult {
  const {
    crop,
    soilCondition,
    insects,
    affectedPlants,
    symptomsDuration = 'Few Days',
    weather,
    selectedScenario = 'auto',
  } = input

  // 1. Check for poor image quality or explicit low-confidence / uncertain scenario
  if (input.imageQuality?.state === 'poor' || selectedScenario === 'uncertain_low_confidence') {
    return createUncertainAssessment(crop, weather, input.imageQuality?.reasons)
  }

  // 2. Deterministic rule evaluation
  const isHighHumidity = weather.humidity >= 60 || weather.recentRain || (weather.rainfallProb ?? 0) >= 30
  const isHighTempDry = (weather.temperature >= 30 || soilCondition === 'Dry') && soilCondition === 'Dry'
  const hasInsects = insects === 'Yes'
  const isWidespread = affectedPlants === 'Many' || affectedPlants === 'Most'

  // Scenario matching
  if (selectedScenario === 'water_stress' || (!hasInsects && isHighTempDry && selectedScenario === 'auto')) {
    return generateWaterStressResult(crop, soilCondition, weather, affectedPlants, symptomsDuration)
  }

  if (selectedScenario === 'pest_attack' || (hasInsects && selectedScenario === 'auto')) {
    return generatePestAttackResult(crop, soilCondition, weather, affectedPlants, symptomsDuration)
  }

  if (selectedScenario === 'nutrient_deficiency') {
    return generateNutrientDeficiencyResult(crop, soilCondition, weather, affectedPlants, symptomsDuration)
  }

  // Default / Fungal Stress Rule: High humidity + widespread symptoms + wet/normal soil
  if (selectedScenario === 'fungal_stress' || isHighHumidity || isWidespread) {
    return generateFungalStressResult(crop, soilCondition, weather, affectedPlants, symptomsDuration)
  }

  // Fallback default balanced assessment
  return generateFungalStressResult(crop, soilCondition, weather, affectedPlants, symptomsDuration)
}

// --- Specific Rule Handlers ---

function generateFungalStressResult(
  crop: CropType,
  soilCondition: SoilCondition,
  weather: WeatherData,
  affectedPlants: PlantsAffected,
  duration: SymptomsDuration
): CropAnalysisResult {
  const diseaseMap: Record<CropType, { name: string; chemical: string; organic: string }> = {
    Tomato: {
      name: 'Early Blight (Alternaria solani)',
      chemical: 'Apply Mancozeb 75% WP @ 2.5 g/L of water or Azoxystrobin 23% SC @ 1 ml/L.',
      organic: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Trichoderma viride @ 5 g/L.',
    },
    Rice: {
      name: 'Rice Blast (Magnaporthe oryzae)',
      chemical: 'Foliar spray of Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L.',
      organic: 'Spray Pseudomonas fluorescens 0.5% (5 g/L); drain excess standing water temporarily.',
    },
    Wheat: {
      name: 'Yellow Stripe Rust (Puccinia striiformis)',
      chemical: 'Spray Propiconazole 25% EC @ 1.0 ml/L (200 ml in 200 L water per acre).',
      organic: 'Apply sour buttermilk (chaas 5%) solution or bio-fungicide foliar spray.',
    },
    Cotton: {
      name: 'Alternaria Leaf Spot & Fungal Blight',
      chemical: 'Spray Copper Oxychloride 50% WP @ 2.5 g/L or Pyraclostrobin 20% WG @ 1 g/L.',
      organic: 'Spray bio-fungicide formulation Bacillus subtilis @ 5 g/L with soap spreader.',
    },
    Sugarcane: {
      name: 'Red Rot of Sugarcane (Colletotrichum falcatum)',
      chemical: 'Foliar spray with Thiophanate-methyl 70% WP @ 2 g/L; treat setts with Carbendazim.',
      organic: 'Apply Trichoderma harzianum enriched with composted farmyard manure to root zone.',
    },
  }

  const { name, chemical, organic } = diseaseMap[crop]
  const isHighSeverity = affectedPlants === 'Most' || duration === 'More than a Week'
  const severity = isHighSeverity ? 'High Stress' : 'Moderate Stress'
  const confidence = isHighSeverity ? 94.8 : 91.5

  return {
    overallStatus: severity,
    primaryCause: name,
    confidence,
    possibleCauses: [
      {
        cause: name,
        probability: confidence,
        description: 'Concentric lesions and foliar necrosis consistent with fungal spore sporulation under current humidity.',
      },
      {
        cause: 'Secondary Bacterial Leaf Spot',
        probability: Number((100 - confidence - 3.5).toFixed(1)),
        description: 'Water-soaked margins sometimes co-occur in humid canopy layers.',
      },
      {
        cause: 'Nitrogen Chlorosis Overlap',
        probability: 3.5,
        description: 'Mild bottom leaf yellowing caused by pathogen-induced nutrient translocation disruption.',
      },
    ],
    evidence: [
      `Elevated relative humidity (${weather.humidity}%) creates favorable spore germination index.`,
      `Widespread symptoms reported (${affectedPlants.toLowerCase()} plants affected for ${duration.toLowerCase()}).`,
      `Soil condition reported as ${soilCondition.toLowerCase()}, maintaining damp canopy micro-environment.`,
      'Visual foliar pattern demonstrates characteristic necrotic target margins.',
    ],
    recommendations: {
      immediateActions: [
        'Prune heavily infected lower leaves and safely dispose away from field boundaries.',
        'Avoid overhead sprinkler irrigation to keep the leaf canopy dry.',
      ],
      chemicalSpray: chemical,
      organicAlternative: organic,
      sprayTimingWindow: 'Optimal spray window: Tomorrow morning between 07:00 AM – 10:30 AM before wind exceeds 12 km/h.',
      preventiveMeasures: [
        'Maintain balanced nitrogen fertilization (excess nitrogen softens leaf cuticles).',
        'Ensure proper inter-row spacing to promote sunlight penetration and air circulation.',
      ],
    },
    uncertainty: {
      isUncertain: false,
      confidenceScore: confidence,
    },
    diagnosedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    modelMetadata: {
      engine: 'KrishiVision-Edge-INT8',
      latencyMs: 138,
      offlineProcessed: true,
    },
  }
}

function generateWaterStressResult(
  crop: CropType,
  soilCondition: SoilCondition,
  weather: WeatherData,
  affectedPlants: PlantsAffected,
  duration: SymptomsDuration
): CropAnalysisResult {
  const confidence = 92.0
  const isSevere = affectedPlants === 'Most' || weather.temperature >= 35

  return {
    overallStatus: isSevere ? 'High Stress' : 'Moderate Stress',
    primaryCause: 'Acute Moisture Deficit & Thermal Transpiration Stress',
    confidence,
    possibleCauses: [
      {
        cause: 'Soil Moisture Deficit (Drought Stress)',
        probability: 92.0,
        description: 'Root root-zone depletion causing loss of leaf turgor pressure and stomatal closure.',
      },
      {
        cause: 'Heat Scorch / Solar Scald',
        probability: 5.5,
        description: 'High surface temperatures causing marginal leaf tissue dehydration.',
      },
      {
        cause: 'Early Vascular Wilt',
        probability: 2.5,
        description: 'Early vascular clogging mimics temporary dry-soil wilting.',
      },
    ],
    evidence: [
      `Soil condition confirmed as ${soilCondition.toUpperCase()} with depleted volumetric moisture.`,
      `High daytime ambient temperature (${weather.temperature}°C) exceeding optimal transpiration rates.`,
      `Foliar symptom duration: ${duration.toLowerCase()} across ${affectedPlants.toLowerCase()} plants.`,
      'Absence of fungal sporulation circles on symptomatic leaves.',
    ],
    recommendations: {
      immediateActions: [
        'Initiate controlled irrigation immediately (prefer drip or furrow soaking in late afternoon/evening).',
        'Avoid foliar chemical sprays while crop is turgor-compromised (prevents chemical scorching).',
      ],
      chemicalSpray: 'No fungicide/pesticide recommended. Spray 1% Potassium Nitrate (13-0-45) or anti-transpirant after rehydration.',
      organicAlternative: 'Apply farmyard straw or plastic mulch to conserve residual root moisture.',
      sprayTimingWindow: 'Irrigate after 05:30 PM to minimize evaporative loss.',
      preventiveMeasures: [
        'Install soil moisture sensors or perform daily hand-feel ribbon tests.',
        'Schedule irrigation intervals according to crop phenological flowering stages.',
      ],
    },
    uncertainty: {
      isUncertain: false,
      confidenceScore: confidence,
    },
    diagnosedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    modelMetadata: {
      engine: 'KrishiVision-Edge-INT8',
      latencyMs: 115,
      offlineProcessed: true,
    },
  }
}

function generatePestAttackResult(
  crop: CropType,
  soilCondition: SoilCondition,
  weather: WeatherData,
  affectedPlants: PlantsAffected,
  duration: SymptomsDuration
): CropAnalysisResult {
  const pestMap: Record<CropType, { name: string; chemical: string; organic: string }> = {
    Tomato: {
      name: 'Whitefly (Bemisia tabaci) & Leafminer Complex',
      chemical: 'Spray Diafenthiuron 50% WP @ 1.2 g/L or Cyantraniliprole 10.26% OD @ 1.8 ml/L.',
      organic: 'Install yellow sticky traps (15 per acre); spray Neem oil 10,000 ppm @ 2 ml/L.',
    },
    Rice: {
      name: 'Brown Plant Hopper (BPH / Nilaparvata lugens)',
      chemical: 'Spray Pymetrozine 50% WG @ 0.6 g/L or Triflumezopyrim 10% SC @ 0.5 ml/L targeting plant base.',
      organic: 'Drain field water for 3 days; spray Beauveria bassiana bio-pesticide @ 5 g/L.',
    },
    Wheat: {
      name: 'Foliar Aphids (Rhopalosiphum padi Colony)',
      chemical: 'Spray Thiamethoxam 25% WG @ 0.2 g/L or Dimethoate 30% EC @ 1.5 ml/L.',
      organic: 'Spray Verticillium lecanii @ 5 g/L or garlic-chili foliar emulsion.',
    },
    Cotton: {
      name: 'Whitefly & Sucking Pest Complex (Vector for Leaf Curl)',
      chemical: 'Spray Flonicamid 50% WG @ 0.4 g/L or Pyriproxyfen 10% EC @ 2 ml/L.',
      organic: 'Install yellow & blue sticky traps; foliar spray of 5% NSKE.',
    },
    Sugarcane: {
      name: 'Early Shoot & Top Borer (Scirpophaga excerptalis)',
      chemical: 'Soil application of Chlorantraniliprole 0.4% GR @ 7.5 kg/acre or spray Chlorantraniliprole 18.5% SC @ 0.4 ml/L.',
      organic: 'Release Trichogramma chilonis egg parasitoids @ 20,000 per acre.',
    },
  }

  const { name, chemical, organic } = pestMap[crop]
  const confidence = 93.4

  return {
    overallStatus: affectedPlants === 'Most' ? 'Critical Risk' : 'High Stress',
    primaryCause: name,
    confidence,
    possibleCauses: [
      {
        cause: name,
        probability: confidence,
        description: 'Physical insect presence and leaf puncturing confirmed by field observations.',
      },
      {
        cause: 'Secondary Viral Transmission (Gemini virus)',
        probability: 4.8,
        description: 'Sap-sucking vectors frequently transmit foliar leaf-curl viruses.',
      },
      {
        cause: 'Sooty Mold Development',
        probability: 1.8,
        description: 'Honeydew excretions from sap-feeders support secondary black mold growth.',
      },
    ],
    evidence: [
      'Insects / pest presence explicitly confirmed observed on the plants.',
      `Observed in ${affectedPlants.toLowerCase()} plants with ${duration.toLowerCase()} active spread.`,
      `Ambient temperature of ${weather.temperature}°C supports active insect metabolic reproduction.`,
      'Leaf foliar curling and punctures match sucking insect feeding patterns.',
    ],
    recommendations: {
      immediateActions: [
        'Deploy color-attractant sticky cards (yellow for whiteflies/aphids) to assess infestation density.',
        'Target sprays to the undersides of leaves where nymph colonies shelter.',
      ],
      chemicalSpray: chemical,
      organicAlternative: organic,
      sprayTimingWindow: 'Spray in early morning (07:00 AM - 10:00 AM) or late afternoon when winds are under 10 km/h.',
      preventiveMeasures: [
        'Eradicate weed hosts along field bunds that harbor overwintering insect colonies.',
        'Conserve natural predators such as ladybird beetles and chrysoperla.',
      ],
    },
    uncertainty: {
      isUncertain: false,
      confidenceScore: confidence,
    },
    diagnosedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    modelMetadata: {
      engine: 'KrishiVision-Edge-INT8',
      latencyMs: 146,
      offlineProcessed: true,
    },
  }
}

function generateNutrientDeficiencyResult(
  crop: CropType,
  soilCondition: SoilCondition,
  weather: WeatherData,
  affectedPlants: PlantsAffected,
  duration: SymptomsDuration
): CropAnalysisResult {
  const confidence = 89.2

  return {
    overallStatus: 'Moderate Stress',
    primaryCause: `${crop} Nitrogen & Micronutrient (Zinc) Chlorosis`,
    confidence,
    possibleCauses: [
      {
        cause: 'Nitrogen (N) Deficiency',
        probability: 72.0,
        description: 'V-shaped chlorosis extending from leaf tip backwards along the midrib.',
      },
      {
        cause: 'Zinc (Zn) Micronutrient Deficit (Khaira / Little Leaf)',
        probability: 17.2,
        description: 'Rusty bronzing and reduced internodal elongation common in alkaline soils.',
      },
      {
        cause: 'Early Root Waterlogging Chlorosis',
        probability: 10.8,
        description: 'Impaired nutrient uptake from compacted root zones.',
      },
    ],
    evidence: [
      'Uniform interveinal pale yellowing without fungal target margins.',
      `Soil reported as ${soilCondition.toLowerCase()}; no insect pests detected.`,
      `Gradual symptom expression over ${duration.toLowerCase()}.`,
    ],
    recommendations: {
      immediateActions: [
        'Foliar spray of 2% Urea solution (20 g per liter of water) for rapid nitrogen absorption.',
        'Alternatively apply 4 ml/L of IFFCO Nano-Urea during active tillering/growth.',
      ],
      chemicalSpray: 'Foliar spray of Zinc Sulphate (Chelated Zn-EDTA 12%) @ 1.0 g/L.',
      organicAlternative: 'Drench soil with Jeevamrit or fermented vermiwash (10% solution).',
      sprayTimingWindow: 'Morning spray during calm wind hours (08:00 AM – 11:00 AM).',
      preventiveMeasures: [
        'Conduct periodic soil fertility lab testing for available NPK and organic carbon.',
        'Incorporate green manuring crops (Dhaincha/Sunhemp) before seasonal sowing.',
      ],
    },
    uncertainty: {
      isUncertain: false,
      confidenceScore: confidence,
    },
    diagnosedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    modelMetadata: {
      engine: 'KrishiVision-Edge-INT8',
      latencyMs: 122,
      offlineProcessed: true,
    },
  }
}

function createUncertainAssessment(
  crop: CropType,
  weather: WeatherData,
  qualityReasons?: ImageQualityReason[]
): CropAnalysisResult {
  const confidence = 42.0
  const reasonsText = qualityReasons && qualityReasons.length > 0
    ? qualityReasons.join(', ')
    : 'Image resolution and contrast below diagnostic threshold'

  return {
    overallStatus: 'Assessment Uncertain',
    primaryCause: 'Assessment Uncertain',
    confidence,
    possibleCauses: [
      {
        cause: 'Disease',
        probability: 42,
        description: 'Possible foliar pathogen lesions, but image clarity is insufficient to verify fungal or bacterial morphology.',
      },
      {
        cause: 'Nutrient stress',
        probability: 35,
        description: 'Chlorotic foliage resembles early nitrogen or micronutrient deficiency.',
      },
      {
        cause: 'Water stress',
        probability: 23,
        description: 'Mild foliar curling and marginal drooping consistent with root moisture deficit.',
      },
    ],
    evidence: [
      `Image quality flag: ${reasonsText}.`,
      'The available image and field information are insufficient to reliably distinguish the cause.',
      `Ambient temperature: ${weather.temperature}°C, humidity: ${weather.humidity}%.`,
      `Reported on ${crop} with inconclusive visual demarcation.`,
    ],
    recommendations: {
      immediateActions: [
        'Do not apply chemical pesticides without definitive symptom identification.',
        'Retake photo with camera focused directly on a flat, well-lit leaf margin.',
      ],
      chemicalSpray: 'Chemical intervention withheld due to diagnostic uncertainty.',
      organicAlternative: 'Maintain balanced irrigation and re-check crop symptoms in 24 hours.',
      sprayTimingWindow: 'Spray decision deferred until conclusive assessment.',
      preventiveMeasures: [
        'Wipe camera lens, ensure natural daytime lighting, and avoid deep shadows.',
      ],
    },
    uncertainty: {
      isUncertain: true,
      confidenceScore: confidence,
      message: 'The available image and field information are insufficient to reliably distinguish the cause.',
      reason: reasonsText,
      suggestedNextStep: 'Retake the image in good lighting with the crop clearly centered.',
    },
    diagnosedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    modelMetadata: {
      engine: 'KrishiVision-Edge-INT8 (Uncertainty Guardrail)',
      latencyMs: 142,
      offlineProcessed: true,
    },
  }
}

export interface StoredAnalysisRecord {
  id: string
  crop: CropType
  soilCondition: SoilCondition
  insects: InsectsOption
  affectedPlants: PlantsAffected
  symptomsDuration: SymptomsDuration
  weather: WeatherData
  imagePreview?: string
  result: CropAnalysisResult
  createdAt: string
}

const analysisStorageKey = 'krishi_saathi_recent_analyses'

export function saveAnalysisRecord(record: StoredAnalysisRecord): void {
  try {
    const existingRaw = sessionStorage.getItem(analysisStorageKey)
    const records: Record<string, StoredAnalysisRecord> = existingRaw ? JSON.parse(existingRaw) : {}
    records[record.id] = record
    sessionStorage.setItem(analysisStorageKey, JSON.stringify(records))
  } catch {
    // sessionStorage fallback ignored
  }
}

export function getAnalysisRecord(id: string): StoredAnalysisRecord | null {
  try {
    const existingRaw = sessionStorage.getItem(analysisStorageKey)
    if (existingRaw) {
      const records: Record<string, StoredAnalysisRecord> = JSON.parse(existingRaw)
      if (records[id]) return records[id]
    }
  } catch {
    // fallback
  }

  // Fallback mock record for direct navigation (e.g. /result/demo or /result/sample)
  const defaultCrop: CropType = id.toLowerCase().includes('rice')
    ? 'Rice'
    : id.toLowerCase().includes('wheat')
    ? 'Wheat'
    : id.toLowerCase().includes('cotton')
    ? 'Cotton'
    : id.toLowerCase().includes('cane') || id.toLowerCase().includes('sugarcane')
    ? 'Sugarcane'
    : 'Tomato'

  const mockWeather: WeatherData = {
    temperature: 28.5,
    humidity: 64,
    windSpeed: 8,
    rainfallProb: 15,
    recentRain: false,
  }

  const isUncertainScenario = id.toLowerCase().includes('uncertain') || id.toLowerCase().includes('poor')

  const result = isUncertainScenario
    ? createUncertainAssessment(defaultCrop, mockWeather, ['Image blurry'])
    : analyzeCrop({
        crop: defaultCrop,
        soilCondition: 'Normal',
        insects: 'No',
        affectedPlants: 'Many',
        symptomsDuration: 'Few Days',
        weather: mockWeather,
        selectedScenario: 'auto',
      })

  return {
    id,
    crop: defaultCrop,
    soilCondition: 'Normal',
    insects: 'No',
    affectedPlants: 'Many',
    symptomsDuration: 'Few Days',
    weather: mockWeather,
    result,
    createdAt: 'Just now',
  }
}

