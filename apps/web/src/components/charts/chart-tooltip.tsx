import { formatKpiValue } from '@/lib/kpis';

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
  unit?: 'number' | 'currency' | 'percent';
};

export function ChartTooltip({ active, payload, label, unit = 'number' }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-white p-3 shadow-panel">
      <p className="mb-2 text-sm font-semibold text-muted-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}:</span>
            <span className="text-sm font-semibold text-foreground">
              {formatKpiValue({ value: entry.value, unit })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
