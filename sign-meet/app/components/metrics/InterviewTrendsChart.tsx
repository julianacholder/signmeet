'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, MessagesSquare, TrendingDown } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ChartDataPoint {
  month: string;
  growth: number;
}

interface StatCardData {
  label: string;
  value: string;
  change: string;
  changeValue: string;
  isPositive: boolean;
  icon: React.ElementType;
  highlighted?: boolean;
}

interface InterviewTrendsChartProps {
  title?: string;
  chartData: ChartDataPoint[];
  stats: StatCardData[];
  periodLabel?: string;
  dateRange?: string;
  onPeriodChange?: (value: string) => void;
  defaultPeriod?: string;
}

const chartConfig = {
  growth: {
    label: 'Growth',
    color: 'hsl(var(--lightblue))',
  },
} satisfies ChartConfig;

export default function InterviewTrendsChart({
  title = 'Interview Trends',
  chartData,
  stats,
  periodLabel = 'Growth',
  dateRange = 'Jun 2023 - Dec 2023',
  onPeriodChange,
  defaultPeriod = 'monthly'
}: InterviewTrendsChartProps) {
  return (
    <Card className='py-4 gap-4'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Select defaultValue={defaultPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="flex items-center justify-between mb-1">
          {/* Date Range */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1">{periodLabel}</h3>
            <p className="text-sm text-muted-foreground">{dateRange}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className={`rounded-md p-2 flex items-center gap-5 mb-2 w-fit ${
                  stat.highlighted ? 'bg-[#E6E9FF]' : 'border'
                }`}>
                  <div>
                    <stat.icon 
                      className="w-5 h-5 text-primary" 
                      fill={stat.icon === MessagesSquare ? 'currentColor' : 'none'}
                    />
                    <p className="text-xs font-medium">{stat.label}</p>
                  </div>
                  <div>
                    <p className={`text-md font-bold ${stat.highlighted ? 'text-lightblue' : ''}`}>
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      <span>{stat.changeValue}</span>
                      {stat.isPositive ? (
                        <TrendingUp className="w-3 h-3 text-lightblue" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className={stat.isPositive ? 'text-lightblue' : 'text-red-600'}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}.000`}
              ticks={[0, 1500, 3000, 15000, 25000, 45000]}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="growth"
              fill="var(--color-lightblue)"
              radius={[8, 8, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}