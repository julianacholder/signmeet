'use client';

import TopCountriesMap from '@/app/components/metrics/TopCountriesMap';
import InterviewTrendsChart from '@/app/components/metrics/InterviewTrendsChart';
import HiresLineChart from '@/app/components/metrics/HiresLineChart';
import TranslationTimePieChart from '@/app/components/metrics/TranslationTimePieChart';
import { TrendingUp, MessagesSquare, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const chartData = [
  { month: 'Dec 18', growth: 10000 },
  { month: 'Dec 19', growth: 35000 },
  { month: 'Dec 20', growth: 25000 },
  { month: 'Dec 21', growth: 5000 },
  { month: 'Dec 22', growth: 12000 },
  { month: 'Dec 23', growth: 28000 },
  { month: 'Dec 24', growth: 27000 },
];

const statsData = [
  {
    label: 'Growth',
    value: '23,430',
    change: '23%',
    changeValue: '+412',
    isPositive: true,
    icon: TrendingUp,
    highlighted: true
  },
  {
    label: 'Follow',
    value: '25,592',
    change: '23%',
    changeValue: '+804',
    isPositive: true,
    icon: MessagesSquare
  },
  {
    label: 'Unfollow',
    value: '100',
    change: '13%',
    changeValue: '-4',
    isPositive: false,
    icon: MessagesSquare
  }
];

// Hires line chart data
const hiresData = [
  { month: 'Dec 18', hires: 3200 },
  { month: 'Dec 19', hires: 4100 },
  { month: 'Dec 20', hires: 2800 },
  { month: 'Dec 21', hires: 4800 },
  { month: 'Dec 22', hires: 6200 },
  { month: 'Dec 23', hires: 4500 },
  { month: 'Dec 24', hires: 3200 },
  { month: 'Dec 25', hires: 5100 },
];

// Translation time pie chart data
const translationData = [
  { name: 'RSL', value: 45, color: '#2E3890' },
  { name: 'ASL', value: 30, color: '#1745C1' }
];

const handlePeriodChange = (value: string) => {
  console.log('Period changed to:', value);
};

export default function CompanyDeiMetricsPage() {
  return (
    <div className="p-6">
       {/* Hedaing Section */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-2">DEI Metrics</h1>
        <Button 
              className="bg-primary hover:bg-hoverPrimary"
              
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
      </div>
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="w-[60%] space-y-6">
          {/* Interview Trends Chart */}
          <InterviewTrendsChart
            title="Interview Trends"
            chartData={chartData}
            stats={statsData}
            periodLabel="Growth"
            dateRange="Jun 2023 - Dec 2023"
            onPeriodChange={handlePeriodChange}
            defaultPeriod="monthly"
          />

          {/* Top Countries */}
          <TopCountriesMap />
        </div>

        {/* Right Column */}
        <div className="w-[41%] space-y-6">
          {/* Hires Line Chart */}
          <HiresLineChart
            title="Hires"
            data={hiresData}
            totalValue="$12,390"
            onPeriodChange={handlePeriodChange}
            defaultPeriod="monthly"
          />

          {/* Translation Time Pie Chart */}
          <TranslationTimePieChart
            title="Translation Time"
            data={translationData}
            totalTime="2,450 hrs"
            onPeriodChange={handlePeriodChange}
            defaultPeriod="monthly"
          />
        </div>
      </div>
    </div>
  );
}