import React from 'react'
import {
  CloudSun,
  Wind,
  Droplets,
  CloudRain,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, Badge } from '../components/ui'
import type { WeatherDay } from '../types'

export const WeatherPage: React.FC = () => {

  const forecastDays: WeatherDay[] = [
    {
      day: 'Today',
      date: 'Sep 29',
      tempMax: 31,
      tempMin: 22,
      condition: 'Partly Sunny',
      rainfallProb: 15,
      humidity: 58,
      windSpeed: 8,
      advisoryNote: 'Optimal for morning foliar spray until 11:30 AM.',
    },
    {
      day: 'Tomorrow',
      date: 'Sep 30',
      tempMax: 29,
      tempMin: 21,
      condition: 'Humid Overcast',
      rainfallProb: 45,
      humidity: 78,
      windSpeed: 14,
      advisoryNote: 'High humidity increases fungal spore germination risk.',
    },
    {
      day: 'Wednesday',
      date: 'Oct 01',
      tempMax: 27,
      tempMin: 19,
      condition: 'Scattered Showers',
      rainfallProb: 75,
      humidity: 85,
      windSpeed: 18,
      advisoryNote: 'Do not spray. Rain wash-off will waste chemical investments.',
    },
    {
      day: 'Thursday',
      date: 'Oct 02',
      tempMax: 30,
      tempMin: 20,
      condition: 'Clear Sky',
      rainfallProb: 10,
      humidity: 55,
      windSpeed: 9,
      advisoryNote: 'Excellent post-rain spray window for systemic protectants.',
    },
    {
      day: 'Friday',
      date: 'Oct 03',
      tempMax: 32,
      tempMin: 22,
      condition: 'Sunny & Dry',
      rainfallProb: 5,
      humidity: 48,
      windSpeed: 7,
      advisoryNote: 'Standard field operations and irrigation advisable.',
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <CloudSun className="w-4 h-4" />
            <span>Micro-Climate & Spray Windows</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Agri Weather & Spray Advisory
          </h1>
          <p className="text-sm text-slate-500">
            Localized forecasts calibrated for fungicide efficacy, drift risk, and pest development cycles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="offline" size="sm" withDot>
            Cached for Offline Use (Updated 08:00 AM)
          </Badge>
        </div>
      </div>

      {/* Spray Window Banner */}
      <Card className="border-emerald-300 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 rounded-3xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SPRAY WINDOW ACTIVE TODAY</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Ideal Spray Hours: 07:00 AM – 11:30 AM
            </h2>
            <p className="text-sm text-emerald-100 font-normal leading-relaxed">
              Current wind speeds are 8 km/h with low spray droplet drift. Relative humidity is within the safe 50-65% bracket for foliar fungicide absorption.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/10 text-center">
            <div>
              <span className="text-[11px] text-emerald-300 uppercase font-medium">Wind Speed</span>
              <p className="text-xl font-extrabold text-white mt-0.5">8 km/h</p>
              <span className="text-[10px] text-emerald-400">Safe (&lt; 15 km/h)</span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-300 uppercase font-medium">Rain Risk</span>
              <p className="text-xl font-extrabold text-white mt-0.5">15%</p>
              <span className="text-[10px] text-emerald-400">No rain expected</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-emerald-300 uppercase font-medium">Delta-T Index</span>
              <p className="text-xl font-extrabold text-amber-300 mt-0.5">4.2</p>
              <span className="text-[10px] text-amber-300">Optimal (2 - 8)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 5-Day Forecast Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">5-Day Agricultural Weather Forecast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {forecastDays.map((day, idx) => (
            <Card key={idx} className="hover:border-emerald-300 transition-all">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{day.day}</h3>
                    <span className="text-[11px] text-slate-400">{day.date}</span>
                  </div>
                  <Badge variant={day.rainfallProb > 50 ? 'danger' : 'neutral'} size="sm">
                    {day.tempMax}° / {day.tempMin}°
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5 text-sky-500" /> Rain Prob:
                    </span>
                    <strong className={day.rainfallProb > 50 ? 'text-rose-600' : 'text-slate-800'}>
                      {day.rainfallProb}%
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" /> Humidity:
                    </span>
                    <strong className="text-slate-800">{day.humidity}%</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-teal-600" /> Wind:
                    </span>
                    <strong className="text-slate-800">{day.windSpeed} km/h</strong>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-snug">
                  {day.advisoryNote}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
