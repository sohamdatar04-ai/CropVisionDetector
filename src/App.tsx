import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import { AppLayout } from './components/layout/AppLayout'

// Pages
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { AnalyzePage } from './pages/AnalyzePage'
import { HistoryPage } from './pages/HistoryPage'
import { AssistantPage } from './pages/AssistantPage'
import { FieldsPage } from './pages/FieldsPage'
import { WeatherPage } from './pages/WeatherPage'
import { OfflinePage } from './pages/OfflinePage'
import { SettingsPage } from './pages/SettingsPage'
import { ResultPage } from './pages/ResultPage'

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="analyze" element={<AnalyzePage />} />
              <Route path="result/:id" element={<ResultPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="fields" element={<FieldsPage />} />
              <Route path="weather" element={<WeatherPage />} />
              <Route path="offline" element={<OfflinePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
