import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Plus,
  Scan,
  CheckCircle,
} from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Modal } from '../components/ui'
import { useToast } from '../context/ToastContext'
import type { FieldPlot } from '../types'

export const FieldsPage: React.FC = () => {
  const { showToast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newPlotName, setNewPlotName] = useState('')
  const [newPlotCrop, setNewPlotCrop] = useState('Wheat')
  const [newPlotAcreage, setNewPlotAcreage] = useState('2.5')

  const [plots, setPlots] = useState<FieldPlot[]>([
    {
      id: 'f1',
      name: 'Plot 1 - North Acre',
      crop: 'Wheat (PBW 550)',
      acreage: 3.5,
      sowingDate: 'Nov 12, 2025',
      currentStage: 'Tillering Stage',
      healthScore: 78,
      lastScanned: '2 hours ago',
      stressDetected: 'Yellow Rust Early Risk',
    },
    {
      id: 'f2',
      name: 'Plot 2 - River Bed Field',
      crop: 'Mustard (Pusa Bold)',
      acreage: 2.0,
      sowingDate: 'Oct 28, 2025',
      currentStage: 'Flowering Stage',
      healthScore: 64,
      lastScanned: 'Yesterday',
      stressDetected: 'Aphids Observed',
    },
    {
      id: 'f3',
      name: 'Plot 3 - Southern Terrace',
      crop: 'Chickpea / Gram',
      acreage: 4.0,
      sowingDate: 'Nov 04, 2025',
      currentStage: 'Pod Formation',
      healthScore: 94,
      lastScanned: '3 days ago',
    },
    {
      id: 'f4',
      name: 'Plot 4 - Canal West',
      crop: 'Paddy / Basmati',
      acreage: 3.0,
      sowingDate: 'Dec 02, 2025',
      currentStage: 'Vegetative Phase',
      healthScore: 91,
      lastScanned: '4 days ago',
    },
  ])

  const handleAddPlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlotName) return

    const newPlot: FieldPlot = {
      id: `f-${Date.now()}`,
      name: newPlotName,
      crop: newPlotCrop,
      acreage: parseFloat(newPlotAcreage) || 1.0,
      sowingDate: 'Recently',
      currentStage: 'Initial Germination',
      healthScore: 100,
      lastScanned: 'Never',
    }

    setPlots((prev) => [newPlot, ...prev])
    setIsAddModalOpen(false)
    setNewPlotName('')
    showToast({
      title: 'Plot Created',
      message: `${newPlotName} has been saved to local offline database.`,
      type: 'success',
    })
  }

  const totalAcreage = plots.reduce((acc, p) => acc + p.acreage, 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <MapPin className="w-4 h-4" />
            <span>Farm Plots & Demarcations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Registered Field Plots
          </h1>
          <p className="text-sm text-slate-500">
            Total of {plots.length} active plots ({totalAcreage.toFixed(1)} Acres under management)
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Plot
        </Button>
      </div>

      {/* Plots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {plots.map((plot) => (
          <Card key={plot.id} className="hover:border-emerald-300 transition-all">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div>
                <CardTitle className="text-lg">{plot.name}</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {plot.crop} • {plot.acreage} Acres
                </CardDescription>
              </div>

              <Badge
                variant={
                  plot.healthScore >= 90
                    ? 'success'
                    : plot.healthScore >= 70
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
                withDot
              >
                {plot.healthScore}% Vigor
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Crop Stage</span>
                  <span className="font-semibold text-slate-800">{plot.currentStage}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Sowing Date</span>
                  <span className="font-semibold text-slate-800">{plot.sowingDate}</span>
                </div>
              </div>

              {plot.stressDetected ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between text-amber-900">
                  <span className="font-medium">⚠️ {plot.stressDetected}</span>
                  <span className="text-amber-700 text-[11px] font-semibold">Action Due</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Optimal vegetative health</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-slate-50/70 border-t border-slate-100 flex items-center justify-between p-4">
              <span className="text-[11px] text-slate-400">
                Last checked: {plot.lastScanned}
              </span>
              <div className="flex items-center gap-2">
                <Link to="/analyze">
                  <Button variant="outline" size="sm" leftIcon={<Scan className="w-3.5 h-3.5" />}>
                    Scan Leaf
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Plot Modal Dialog */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Field Plot"
        description="Add a new demarcation to track crop stress and localized weather advisory"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddPlot}>
              Save Field Plot
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddPlot} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plot Name / Location Identifier
            </label>
            <input
              type="text"
              required
              placeholder="e.g. East Terrace Corner"
              value={newPlotName}
              onChange={(e) => setNewPlotName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Type
              </label>
              <select
                value={newPlotCrop}
                onChange={(e) => setNewPlotCrop(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Wheat">Wheat</option>
                <option value="Mustard">Mustard</option>
                <option value="Rice / Paddy">Rice / Paddy</option>
                <option value="Cotton">Cotton</option>
                <option value="Chickpea">Chickpea</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Acreage Area (Acres)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={newPlotAcreage}
                onChange={(e) => setNewPlotAcreage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
