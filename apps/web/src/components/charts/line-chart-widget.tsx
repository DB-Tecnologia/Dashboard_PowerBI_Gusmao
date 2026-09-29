import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

import { ChartTooltip } from './chart-tooltip';

type LineSeries = {
  dataKey: string;
  name: string;
  color: string;
  strokeDasharray?: string;
};

type LineChartWidgetProps = {
  title: string;
  description: string;
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: LineSeries[];
  unit?: 'number' | 'currency' | 'percent';
  onPointClick?: (data: Record<string, unknown>) => void;
};

const axisTick = { fontSize: 13, fill: 'hsl(var(--muted-foreground))' };

export function LineChartWidget({
  title,
  description,
  data,
  xKey,
  series,
  unit = 'number',
  onPointClick,
}: LineChartWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            onClick={(e) => {
              if (onPointClick && e && e.activePayload) {
                onPointClick(e.activePayload[0].payload as Record<string, unknown>);
              }
            }}
          >
            <CartesianGrid stroke="hsl(var(--chart-grid))" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              minTickGap={16}
              tickMargin={10}
            />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={56} />
            <Tooltip content={<ChartTooltip unit={unit} />} />
            <Legend wrapperStyle={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }} />
            {series.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                strokeWidth={s.strokeDasharray ? 2 : 3}
                strokeDasharray={s.strokeDasharray}
                dot={{ r: 3.5, strokeWidth: 1.5, fill: '#ffffff' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: '#ffffff' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
