'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface TranslationDataPoint {
  name: string;
  value: number;
  color: string;
}

interface TranslationTimePieChartProps {
  title?: string;
  data: TranslationDataPoint[];
  totalTime?: string;
  onPeriodChange?: (value: string) => void;
  defaultPeriod?: string;
}

const chartConfig = {
  time: {
    label: 'Translation Time',
  },
} satisfies ChartConfig;

export default function TranslationTimePieChart({
  title = 'Translation Time',
  data,
  totalTime = '2,450 hrs',
  onPeriodChange,
  defaultPeriod = 'monthly'
}: TranslationTimePieChartProps) {
  return (
    <Card className='pb-14'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Select defaultValue={defaultPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue />
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
        <div className="flex items-center justify-between">
          {/* Pie Chart */}
          <div className="w-1/2">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* Legend */}
          <div className="w-1/2 space-y-3">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-lg font-bold">{totalTime}</p>
            </div>
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}