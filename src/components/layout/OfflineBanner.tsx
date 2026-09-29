import React from 'react'
import { WifiOff, Database, ArrowUpCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const OfflineBanner: React.FC = () => {
  const { isOffline, offlineQueueCount, toggleOfflineMode } = useApp()

  if (!isOffline) return null

  return (
    <div className="bg-stone-900 text-stone-100 border-b border-stone-800 px-4 py-2.5 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-full bg-amber-500/20 text-amber-400">
            <WifiOff className="w-4 h-4" />
          </span>
          <span className="font-semibold text-amber-400">Offline Edge Mode Active:</span>
          <span className="text-stone-300 hidden sm:inline">
            Local models ready. Diagnoses will run 100% on-device.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-stone-300">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{offlineQueueCount} scans in local queue</span>
          </span>
          <button
            onClick={toggleOfflineMode}
            className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer text-xs flex items-center gap-1"
          >
            <ArrowUpCircle className="w-3 h-3" />
            Simulate Online
          </button>
        </div>
      </div>
    </div>
  )
}
