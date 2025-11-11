'use client';

import { Activity, TrendingUp } from 'lucide-react';

interface ModelMetricsProps {
  confidence?: number;
  templateResponses?: number;
  signsDetected?: number;
}

export default function ModelMetrics({
  confidence = 0,
  templateResponses = 0,
  signsDetected = 0
}: ModelMetricsProps) {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Model Metrics</h3>
      </div>

      <div className="space-y-4">
        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Confidence</span>
            <span className="text-sm font-semibold">{confidence}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Template Responses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Template responses</span>
            <span className="text-sm font-semibold">{templateResponses}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${templateResponses}%` }}
            ></div>
          </div>
        </div>

        {/* Signs Detected (Optional - for real-time updates) */}
        {signsDetected > 0 && (
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Signs detected:</span>
              <span className="text-sm font-semibold text-green-400">
                {signsDetected}
              </span>
            </div>
          </div>
        )}

        {/* Placeholder message when no data */}
        {confidence === 0 && templateResponses === 0 && (
          <div className="text-center py-4 text-gray-500 text-xs">
            <p>RSL translation will appear here</p>
            <p className="mt-1">when active</p>
          </div>
        )}
      </div>
    </div>
  );
}