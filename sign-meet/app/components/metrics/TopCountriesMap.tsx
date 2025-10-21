'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorldMap } from 'react-svg-worldmap';

export default function TopCountriesMap() {
  const topCountries = [
    { country: 'rw', value: 12000 },
    { country: 'lr', value: 10600 },
    { country: 'ke', value: 16000 },
    { country: 'ng', value: 16000 }
  ];

  const countryDetails = [
    { name: 'Rwanda', value: 12000, percentage: 100 },
    { name: 'Liberia', value: 10600, percentage: 87 },
    { name: 'Kenya', value: 16000, percentage: 75 },
    { name: 'Nigeria', value: 16000, percentage: 58 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Countries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8 flex-wrap md:flex-nowrap">
          {/* Map Section */}
          <div className="w-full md:w-1/2">
            <WorldMap
              color="#2E3890"
              backgroundColor="#FFFFFF"
              valueSuffix=" users"
              size="md"
              data={topCountries}
            />
          </div>

          {/* Bars Section */}
          <div className="w-full md:w-1/2 space-y-4">
            {countryDetails.map((country, index) => (
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
