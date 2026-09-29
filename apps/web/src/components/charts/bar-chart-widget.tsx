import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

import { ChartTooltip } from './chart-tooltip';

type BarChartWidgetProps = {
  title: string;
  description: string;
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  color?: string;
  unit?: 'number' | 'currency' | 'percent';
  onBarClick?: (data: Record<string, unknown>) => void;
};

export function BarChartWidget({
  title,
  description,
  data,
  xKey,
  yKey,
  color = 'hsl(var(--chart-forest))',
  unit = 'number',
  onBarClick,
}: BarChartWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid stroke="hsl(var(--chart-grid))" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickMargin={10}
            />
            <YAxis
              tick={{ fontSize: 13, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={48}
            />
            <Tooltip content={<ChartTooltip unit={unit} />} />
            <Bar
              dataKey={yKey}
              fill={color}
              radius={[8, 8, 0, 0]}
              onClick={(_, index) => {
                if (onBarClick) {
                  onBarClick(data[index] as Record<string, unknown>);
                }
              }}
              cursor={onBarClick ? 'pointer' : 'default'}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
