import React, { useState } from 'react'
import {
  HardDriveDownload,
  WifiOff,
  Wifi,
  Database,
  CloudUpload,
  RefreshCw,
  Cpu,
} from 'lucide-react'
import { Button, Card, CardContent, Badge } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

export const OfflinePage: React.FC = () => {
  const { showToast } = useToast()
  const { isOffline, toggleOfflineMode, offlineQueueCount } = useApp()
  const [isSyncing, setIsSyncing] = useState(false)

  const offlineModels = [
    {
      id: 'm-wheat',
      name: 'Wheat Pathology & Foliar Chlorosis',
      crop: 'Wheat (Triticum aestivum)',
      size: '18.4 MB',
      version: 'v2.4-int8',
      updated: 'Sep 20, 2026',
      status: 'cached',
    },
    {
      id: 'm-rice',
      name: 'Rice Blast & Sheath Blight Vision',
      crop: 'Rice / Paddy (Oryza sativa)',
      size: '21.2 MB',
      version: 'v2.1-int8',
      updated: 'Sep 18, 2026',
      status: 'cached',
    },
    {
      id: 'm-mustard',
      name: 'Mustard Aphid & White Rust Model',
      crop: 'Mustard (Brassica juncea)',
      size: '14.6 MB',
      version: 'v1.9-int8',
      updated: 'Sep 15, 2026',
      status: 'cached',
    },
    {
      id: 'm-cotton',
      name: 'Cotton Bollworm & Leaf Curl Virus',
      crop: 'Cotton (Gossypium)',
      size: '16.8 MB',
      version: 'v2.0-int8',
      updated: 'Sep 12, 2026',
      status: 'cached',
    },
  ]

  const handleSyncAll = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      showToast({
        title: 'Sync Completed',
        message: 'All 3 queued field scans synchronized with central registry.',
        type: 'success',
      })
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <HardDriveDownload className="w-4 h-4" />
            <span>Zero-Connectivity Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Offline Hub & Local Edge Center
          </h1>
          <p className="text-sm text-slate-500">
            Manage local on-device neural weights, offline diagnostic queue, and IndexedDB cache
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isOffline ? 'earth' : 'secondary'}
            size="md"
            onClick={toggleOfflineMode}
            leftIcon={isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          >
            {isOffline ? 'Mode: Simulated Offline' : 'Mode: Online'}
          </Button>
        </div>
      </div>

      {/* Storage and Sync Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">On-Device Storage</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">71.0 MB</span>
              <span className="text-xs text-slate-400">/ 500 MB quota</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full w-[14%]" />
            </div>
            <span className="text-[11px] text-slate-500 block pt-1">
              4 edge models + 38 cached diagnostic records
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pending Sync Queue</span>
              <CloudUpload className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-700">{offlineQueueCount} Scans</span>
              <Badge variant="warning" size="sm">Local Only</Badge>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Recorded in the field without signal. Automatically syncs on reconnection.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Manual Edge Sync</span>
              <p className="text-xs text-slate-600 mt-1">
                Push all queued local evaluations to farm advisory cloud
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              fullWidth
              isLoading={isSyncing}
              onClick={handleSyncAll}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              {isSyncing ? 'Synchronizing...' : 'Sync Queued Scans'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Downloaded On-Device Models */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">On-Device Edge Vision Models</h2>
            <p className="text-xs text-slate-500">Quantized INT8 models for sub-200ms CPU mobile inference</p>
          </div>
          <Badge variant="success" size="sm">All 4 Ready Offline</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offlineModels.map((model) => (
            <Card key={model.id} className="hover:border-slate-300 transition-colors">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{model.name}</h3>
                      <p className="text-xs text-slate-500">{model.crop}</p>
                    </div>
                  </div>

                  <Badge variant="success" size="sm" withDot>
                    Cached
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Size</span>
                    <strong className="text-slate-800">{model.size}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Weights</span>
                    <strong className="text-slate-800 font-mono">{model.version}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Updated</span>
                    <strong className="text-slate-800">{model.updated}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => showToast({ title: 'Cache Verified', message: `${model.name} is verified for offline use.`, type: 'info' })}
                  >
                    Verify Hash
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
