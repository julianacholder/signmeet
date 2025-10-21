'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// Using a more reliable CDN for the world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function TopCountriesMap() {
  const topCountries = [
    { name: 'Rwanda', code: 'RWA', value: 12000, percentage: 100 },
    { name: 'Liberia', code: 'LBR', value: 10600, percentage: 87 },
    { name: 'Kenya', code: 'KEN', value: 16000, percentage: 75 },
    { name: 'Nigeria', code: 'NGA', value: 16000, percentage: 58 }
  ];

  const highlightedCountries = ['646', '430', '404', '566']; // ISO numeric codes: Rwanda, Liberia, Kenya, Nigeria

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Countries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8">
          {/* Map Section */}
          <div className="w-1/2 bg-gray-50 rounded-lg p-4 border">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 220,
                center: [20, 5] 
              }}
              width={400}
              height={280}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isHighlighted = highlightedCountries.includes(geo.id);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isHighlighted ? "#2E3890" : "#CCCED5"}
                        stroke="#FFFFFF"
                        strokeWidth={0.6}
                        style={{
                          default: { outline: 'none' },
                          hover: { 
                            outline: 'none', 
                            fill: isHighlighted ? "hsl(var(--primary))" : "#D1D5DB",
                            cursor: 'pointer'
                          },
                          pressed: { outline: 'none' }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          {/* Bars Section */}
          <div className="w-1/2 space-y-4">
            {topCountries.map((country, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{country.name}</span>
                  <span className="text-sm font-semibold">
                    {country.value >= 1000 ? `${(country.value / 1000).toFixed(0)}K` : country.value}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all"
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}