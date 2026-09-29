# Krishi Saathi AI (कृषि साथी AI)

> **Offline-First Crop Stress Detection & Field Advisory Platform for Farmers**  
> Hackathon Prototype Foundation & UI Shell

---

## 🌾 Overview
Krishi Saathi AI is designed for farmers operating in rural and edge environments with intermittent or non-existent cellular coverage. It delivers on-device computer vision for immediate foliar disease diagnosis, nutrient deficiency identification, micro-climate weather analysis, and actionable agronomic advisories.

---

## 🚀 Tech Stack
- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Navigation:** React Router 7 (`react-router-dom`)
- **Icons:** Lucide React (`lucide-react`)
- **Typography:** Plus Jakarta Sans / Inter

---

## 📱 Architecture & Pages
- **`/` (Home):** Value proposition, quick diagnostic scanner CTA, edge telemetry, sample cards, and interactive component verifier.
- **`/dashboard`:** Farm overview, aggregated crop health vigor (%), stress risk matrix, plot telemetry list with alert filters.
- **`/analyze`:** Field diagnostic scanner shell with crop selector, on-device model status, leaf image dropzone, sample disease presets, and simulated pathology report.
- **`/history`:** Historical audit log of plant pathology scans, confidence scores, local queue indicators, and detail modal.
- **`/assistant`:** Conversational field agronomist UI shell with prompt chips, safe dosage guardrails, and speech/photo placeholders.
- **`/fields`:** Farm demarcation manager with acreage calculations, crop stage badges, and an interactive "Add Plot" modal.
- **`/weather`:** Micro-climate telemetry, 5-day agri-forecast, and calculated optimal pesticide/fungicide spray window indicators.
- **`/offline`:** On-device neural model manager, IndexedDB local storage monitor, and queued scan synchronizer.
- **`/settings`:** Multilingual language selector (English, हिंदी, मराठी, ਪੰਜਾਬੀ), offline sync preferences, and sunlight contrast calibration.

---

## 🧩 Reusable UI Design System
Built for touchscreens and outdoor sunlight readability:
- **`Button`:** Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`, `earth`), sizes (`sm`, `md`, `lg`, `xl`), fullWidth, left/right icons, loading spinner states.
- **`Card`:** (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) with `default`, `elevated`, `outlined`, `interactive`, and `accent` agricultural tints.
- **`Badge`:** Status tags (`success`, `warning`, `danger`, `info`, `offline`, `neutral`, `earth`) with optional pulse/dot indicators.
- **`Modal`:** Touch-friendly dialog with mobile bottom-sheet conversion, background backdrop, keyboard ESC handling, and header/footer customization.
- **`Toast`:** Context-based notifications (`useToast()`) supporting `success`, `warning`, `error`, `info`, and `offline` alerts with auto-dismiss.

---

## 🛠️ Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```
The dev server runs locally at: `http://localhost:5173/`
