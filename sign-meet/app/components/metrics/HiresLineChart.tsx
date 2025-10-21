'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface HiresDataPoint {
  month: string;
  hires: number;
}

interface HiresLineChartProps {
  title?: string;
  data: HiresDataPoint[];
  totalValue?: string;
  onPeriodChange?: (value: string) => void;
  defaultPeriod?: string;
}

const chartConfig = {
  hires: {
    label: 'Hires',
    color: '#2E3890',
  },
} satisfies ChartConfig;

export default function HiresLineChart({
  title = 'Hires',
  data,
  totalValue = '$12,390',
  onPeriodChange,
  defaultPeriod = 'monthly'
}: HiresLineChartProps) {
  return (
    <Card className='pb-25'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <p className="text-lg font-bold mt-1">{totalValue}</p>
          </div>
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
      <CardContent className='px-5'>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={data}>
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
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              ticks={[0, 2000, 4000, 6000, 8000, 10000]}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="hires"
              stroke="var(--color-hires)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}