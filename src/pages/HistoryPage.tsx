import React, { useState } from 'react'
import {
  History,
  Search,
  CheckCircle,
  Eye,
  FileDown,
  AlertTriangle,
} from 'lucide-react'
import { Button, Card, CardContent, Badge, Modal } from '../components/ui'
import { useToast } from '../context/ToastContext'
import type { ScanRecord } from '../types'

export const HistoryPage: React.FC = () => {
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null)

  const mockScans: ScanRecord[] = [
    {
      id: 'scan-101',
      fieldId: 'f1',
      fieldName: 'Plot 1 - North Acre',
      crop: 'Wheat (PBW 550)',
      timestamp: 'Today, 11:20 AM',
      stressType: 'Yellow Stripe Rust',
      confidence: 94.6,
      severity: 'high',
      recommendationSummary: 'Apply Propiconazole 25% EC foliar spray before upcoming humid morning.',
      offlineProcessed: true,
      synced: false,
    },
    {
      id: 'scan-102',
      fieldId: 'f2',
      fieldName: 'Plot 2 - River Bed Field',
      crop: 'Mustard (Pusa Bold)',
      timestamp: 'Yesterday, 04:45 PM',
      stressType: 'Mustard Aphid Infestation',
      confidence: 91.2,
      severity: 'high',
      recommendationSummary: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Dimethoate 30 EC.',
      offlineProcessed: true,
      synced: true,
    },
    {
      id: 'scan-103',
      fieldId: 'f3',
      fieldName: 'Plot 3 - Southern Terrace',
      crop: 'Chickpea (Gram)',
      timestamp: 'Sep 26, 2026, 09:15 AM',
      stressType: 'Healthy Foliage',
      confidence: 98.4,
      severity: 'low',
      recommendationSummary: 'Optimum chlorophyll levels detected. Continue current irrigation schedule.',
      offlineProcessed: true,
      synced: true,
    },
    {
      id: 'scan-104',
      fieldId: 'f1',
      fieldName: 'Plot 1 - North Acre',
      crop: 'Wheat (PBW 550)',
      timestamp: 'Sep 24, 2026, 02:30 PM',
      stressType: 'Early Nitrogen Deficiency',
      confidence: 88.0,
      severity: 'moderate',
      recommendationSummary: 'Top-dress with Urea @ 25 kg/acre prior to next canal water release.',
      offlineProcessed: true,
      synced: true,
    },
  ]

  const filteredScans = mockScans.filter((item) =>
    item.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.stressType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <History className="w-4 h-4" />
            <span>Field Archives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Diagnostic History Log
          </h1>
          <p className="text-sm text-slate-500">
            Chronological audit of plant pathology scans, AI confidence scores, and historical spray actions
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          leftIcon={<FileDown className="w-4 h-4" />}
          onClick={() => showToast({ title: 'Exporting Archive', message: 'Generating local CSV log...', type: 'info' })}
        >
          Export CSV Log
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, plot name, or disease..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
          </input>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
          <span>Showing <strong>{filteredScans.length}</strong> diagnoses</span>
        </div>
      </div>

      {/* Scans Timeline List */}
      <div className="space-y-3">
        {filteredScans.map((scan) => (
          <Card key={scan.id} className="hover:border-slate-300 transition-all">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    scan.severity === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : scan.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {scan.severity === 'high' || scan.severity === 'moderate' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{scan.stressType}</h3>
                    <Badge
                      variant={
                        scan.severity === 'high'
                          ? 'danger'
                          : scan.severity === 'moderate'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    >
                      {scan.confidence}% Confidence
                    </Badge>
                    {!scan.synced && (
                      <Badge variant="offline" size="sm" withDot>
                        Queued for Sync
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{scan.fieldName}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{scan.crop}</span>
                    <span>•</span>
                    <span>{scan.timestamp}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-1 pt-0.5">
                    {scan.recommendationSummary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye className="w-4 h-4" />}
                  onClick={() => setSelectedRecord(scan)}
                >
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Diagnosis Details: ${selectedRecord.stressType}`}
          description={`${selectedRecord.fieldName} • ${selectedRecord.crop}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedRecord(null)}>
              Close Audit
            </Button>
          }
        >
          <div className="space-y-4 py-2 text-sm text-slate-700">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400">Timestamp</span>
                <p className="font-semibold text-slate-900">{selectedRecord.timestamp}</p>
              </div>
              <div>
                <span className="text-slate-400">AI Confidence</span>
                <p className="font-semibold text-slate-900">{selectedRecord.confidence}%</p>
              </div>
              <div>
                <span className="text-slate-400">Processing Mode</span>
                <p className="font-semibold text-slate-900">On-Device Edge (Offline)</p>
              </div>
              <div>
                <span className="text-slate-400">Cloud Sync Status</span>
                <p className="font-semibold text-slate-900">
                  {selectedRecord.synced ? 'Synced' : 'Pending Network Sync'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Advisory Recommendation:</h4>
              <p className="text-xs leading-relaxed text-slate-600 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                {selectedRecord.recommendationSummary}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
