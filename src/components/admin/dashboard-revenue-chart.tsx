'use client'

import * as React from 'react'
import { RevenueDataPoint } from '@/lib/admin-data'

interface DashboardRevenueChartProps {
  data: RevenueDataPoint[]
}

export function DashboardRevenueChart({ data }: DashboardRevenueChartProps) {
  const [activeMetric, setActiveMetric] = React.useState<'total' | 'subscriptions' | 'dailyAds' | 'featured'>('total')
  const [hoveredPoint, setHoveredPoint] = React.useState<RevenueDataPoint | null>(null)

  const maxVal = Math.max(...data.map((d) => d[activeMetric]), 1000)

  return (
    <div className="flex flex-col gap-4">
      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMetric('total')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'total'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Revenue (₹)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('subscriptions')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'subscriptions'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ₹49 Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('dailyAds')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'dailyAds'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ₹99 24h Ads
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('featured')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'featured'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ₹199 Featured/Plots
          </button>
        </div>

        {/* Hover Readout */}
        <div className="text-right">
          {hoveredPoint ? (
            <div className="text-xs">
              <span className="text-slate-400 font-medium">{hoveredPoint.date}: </span>
              <span className="font-black text-slate-900 text-sm">
                ₹{hoveredPoint[activeMetric].toLocaleString('en-IN')}
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Hover bars to view daily revenue</div>
          )}
        </div>
      </div>

      {/* SVG Bar / Area Visualization */}
      <div className="h-56 w-full flex items-end gap-2 pt-6 pb-2 px-2">
        {data.map((item, idx) => {
          const val = item[activeMetric]
          const heightPercent = Math.round((val / maxVal) * 100)

          return (
            <div
              key={item.date}
              className="group relative flex flex-1 flex-col items-center h-full justify-end"
              onMouseEnter={() => setHoveredPoint(item)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-9 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
                <span>₹{val.toLocaleString('en-IN')}</span>
                <span className="text-[9px] font-normal text-slate-300">{item.date}</span>
              </div>

              {/* Bar Fill */}
              <div
                className="w-full max-w-[28px] rounded-t-lg transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                style={{
                  height: `${Math.max(heightPercent, 6)}%`,
                  background:
                    activeMetric === 'total'
                      ? 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)'
                      : activeMetric === 'subscriptions'
                      ? 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
                      : activeMetric === 'dailyAds'
                      ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)'
                      : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                }}
              />

              {/* Date Label */}
              <span className="text-[10px] text-slate-400 font-medium mt-2 truncate w-full text-center">
                {idx % 2 === 0 ? item.date : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend & Summary Info */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span>₹49 Listing Subscriptions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>₹99 24-hr Ads &amp; Stories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>₹199 Featured &amp; Real Estate</span>
          </div>
        </div>

        <span className="font-semibold text-slate-700">
          Last 30 Days Total: ₹{data.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  )
}
