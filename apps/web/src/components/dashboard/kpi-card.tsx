import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';

import { SparklineChart } from '@/components/charts/sparkline-chart';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import {
  calculateKpiDelta,
  formatDelta,
  formatKpiValue,
  getKpiTrend,
  localizeKpiLabel,
  type KpiItem,
  type KpiTrend,
} from '@/lib/kpis';

type KpiCardProps = {
  kpi: KpiItem;
};

const trendLabel: Record<KpiTrend, string> = {
  positive: 'Tendência positiva',
  negative: 'Tendência negativa',
  neutral: 'Tendência neutra',
};

const trendClassName: Record<KpiTrend, string> = {
  positive: 'border-success/20 bg-success/10 text-success',
  negative: 'border-danger/20 bg-danger/10 text-danger',
  neutral: 'border-border bg-muted text-muted-foreground',
};

export function KpiCard({ kpi }: KpiCardProps) {
  const delta = calculateKpiDelta(kpi.value, kpi.previousValue ?? 0);
  const trend = getKpiTrend(delta);
  const TrendIcon =
    trend === 'positive' ? ArrowUpRight : trend === 'negative' ? ArrowDownRight : ArrowRight;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="border border-border bg-background text-muted-foreground">
            {localizeKpiLabel(kpi.sector)}
          </Badge>
          <Badge className={trendClassName[trend]}>
            <TrendIcon className="mr-1 h-3 w-3" aria-hidden="true" />
            {formatDelta(delta)}
          </Badge>
        </div>
        <CardTitle className="mt-4">{localizeKpiLabel(kpi.title)}</CardTitle>
        <CardDescription>{trendLabel[trend]}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight text-foreground">{formatKpiValue(kpi)}</p>
        <p className="mt-2 text-sm text-muted-foreground">Comparado ao período anterior</p>
        <div className="mt-3">
          <SparklineChart value={kpi.value} previousValue={kpi.previousValue ?? kpi.value} />
        </div>
      </CardContent>
    </Card>
  );
}
