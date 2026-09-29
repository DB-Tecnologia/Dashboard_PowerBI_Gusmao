'use client';

import {
  AlertTriangle,
  ArrowLeft,
  ChartBar as BarChart3,
  CalendarDays,
  ChevronRight,
  Clock3,
  Layers as Layers3,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BarChartWidget } from '@/components/charts/bar-chart-widget';
import { LineChartWidget } from '@/components/charts/line-chart-widget';
import { PieChartWidget } from '@/components/charts/pie-chart-widget';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import {
  calculateKpiDelta,
  formatDelta,
  formatKpiValue,
  localizeKpiLabel,
  type BusinessArea,
  type KpiItem,
} from '@/lib/kpis';
import {
  fetchDashboardDrilldown,
  fetchDashboardHome,
  fetchKpiHistory,
  type DashboardDrilldownResponse,
  type DashboardHomeResponse,
  type DrilldownDimension,
  type KpiHistoryResponse,
} from '@/lib/platform-api';

import { KpiCard } from './kpi-card';

const BUSINESS_AREA_LABEL: Record<BusinessArea, string> = {
  producao: 'Produção',
  comercial: 'Comercial',
  algodoeira: 'Algodoeira',
};

const TAB_LABELS = {
  executiva: 'Executiva',
  analitica: 'Analítica',
  operacional: 'Operacional',
} as const;

const MONTHLY_TREND_KPI_IDS = new Set([
  'producao-plantio-area',
  'producao-operacoes-plantio',
  'producao-colheita-area',
  'producao-variedades',
  'producao-talhoes',
  'comercial-contratos',
  'comercial-quantidade-entregue',
  'comercial-quantidade-pendente',
  'comercial-quantidade-devolvida',
  'algodoeira-contratos',
  'algodoeira-embarques',
  'algodoeira-fardos',
]);

type DashboardTab = keyof typeof TAB_LABELS;

type DashboardHomeProps = {
  kpis?: KpiItem[];
};

type RankedKpi = KpiItem & {
  delta: number;
};

export function DashboardHome({ kpis: initialKpis }: DashboardHomeProps) {
  const isDemoMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  const [home, setHome] = useState<DashboardHomeResponse | null>(
    initialKpis
      ? {
          summary: { totalKpis: initialKpis.length, totalSectors: 0, averageDelta: 0 },
          kpis: initialKpis,
          businessAreas: [],
          sectorSummaries: [],
          charts: { sectorDistribution: [], kpiPerformance: [] },
          availableDrilldowns: [],
        }
      : null,
  );
  const [isLoading, setIsLoading] = useState(initialKpis === undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeDrilldown, setActiveDrilldown] = useState<DashboardDrilldownResponse | null>(null);
  const [isDrilldownLoading, setIsDrilldownLoading] = useState(false);
  const [activeKpiId, setActiveKpiId] = useState<string | null>(null);
  const [, setSelectedDimension] = useState<DrilldownDimension | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<DashboardTab>('executiva');
  const [featuredHistory, setFeaturedHistory] = useState<KpiHistoryResponse | null>(null);

  const loadHome = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchDashboardHome();
      setHome(response);
    } catch {
      setErrorMessage('Não foi possível carregar os indicadores de BI.');
      setHome(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialKpis !== undefined) {
      return;
    }

    void loadHome();
  }, [initialKpis, loadHome]);

  const groupedKpis = useMemo(() => {
    const items = new Map<BusinessArea, KpiItem[]>();

    for (const kpi of home?.kpis ?? []) {
      const key = kpi.businessArea ?? inferBusinessArea(kpi.sector);
      const current = items.get(key) ?? [];
      current.push(kpi);
      items.set(key, current);
    }

    return items;
  }, [home?.kpis]);

  const rankedKpis = useMemo<RankedKpi[]>(
    () =>
      [...(home?.kpis ?? [])]
        .map((kpi) => ({
          ...kpi,
          delta: calculateKpiDelta(kpi.value, kpi.previousValue ?? 0),
        }))
        .sort((left, right) => right.delta - left.delta),
    [home?.kpis],
  );

  const monthlyTrendKpis = rankedKpis.filter((kpi) => MONTHLY_TREND_KPI_IDS.has(kpi.id));
  const spotlightKpis = monthlyTrendKpis.length > 0 ? monthlyTrendKpis : rankedKpis;
  const strongestPositive = spotlightKpis[0] ?? null;
  const strongestNegative =
    [...spotlightKpis].sort((left, right) => left.delta - right.delta)[0] ?? null;
  const mostStable =
    [...spotlightKpis].sort((left, right) => Math.abs(left.delta) - Math.abs(right.delta))[0] ??
    null;

  useEffect(() => {
    if (!strongestPositive) {
      setFeaturedHistory(null);
      return;
    }

    let ignore = false;

    void fetchKpiHistory(strongestPositive.id)
      .then((response) => {
        if (!ignore) {
          setFeaturedHistory(response);
        }
      })
      .catch(() => {
        if (!ignore) {
          setFeaturedHistory(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [strongestPositive]);

  const heroAreaCount = home?.businessAreas.length || home?.summary.totalSectors || 0;
  const lineData =
    featuredHistory?.periods.map((item) => ({
      period: item.period,
      atual: item.value,
      anterior: item.previousValue,
    })) ?? [];
  const distributionData =
    home?.charts.sectorDistribution.map((item) => ({
      sector: localizeKpiLabel(item.sector),
      total: item.total,
    })) ?? [];
  const performanceData =
    home?.charts.kpiPerformance.slice(0, 6).map((item) => ({
      title: localizeKpiLabel(item.title),
      delta: item.delta,
    })) ?? [];
  const operationalItems = [...rankedKpis]
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 5);

  const openDrilldown = useCallback(async (kpiId: string, dimension?: DrilldownDimension) => {
    setIsDrilldownLoading(true);
    setErrorMessage(null);
    setActiveKpiId(kpiId);
    setSelectedDimension(dimension);

    try {
      const response = await fetchDashboardDrilldown(kpiId, dimension);
      setActiveDrilldown(response);
    } catch {
      setErrorMessage('Não foi possível carregar o detalhamento selecionado.');
    } finally {
      setIsDrilldownLoading(false);
    }
  }, []);

  const switchDimension = useCallback(
    async (dimension: DrilldownDimension) => {
      if (!activeKpiId) return;
      await openDrilldown(activeKpiId, dimension);
    },
    [activeKpiId, openDrilldown],
  );

  const closeDrilldown = useCallback(() => {
    setActiveDrilldown(null);
    setActiveKpiId(null);
    setSelectedDimension(undefined);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-dashed text-center">
        <CardHeader>
          <div
            className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
            aria-hidden="true"
          />
          <CardTitle>Carregando indicadores</CardTitle>
          <CardDescription>
            {isDemoMode
              ? 'Carregando os dados fictícios da demonstração.'
              : 'Carregando os indicadores do período configurado.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (errorMessage && !home) {
    return (
      <Card className="border-danger/20 bg-danger/5">
        <CardHeader>
          <CardTitle>Falha ao carregar a home</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!home || home.kpis.length === 0) {
    return (
      <Card className="border-dashed text-center">
        <CardHeader>
          <CardTitle>Nenhum KPI disponível</CardTitle>
          <CardDescription>
            Verifique se há dados e se as permissões do seu perfil estão configuradas.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (activeDrilldown) {
    const activeDimensionLabel =
      activeDrilldown.availableDimensions.find((d) => d.dimension === activeDrilldown.dimension)
        ?.label ?? activeDrilldown.dimension;
    const drilldownLabel = localizeKpiLabel(activeDrilldown.label);
    const displayDimensionLabel = localizeKpiLabel(activeDimensionLabel);

    return (
      <section className="space-y-6" aria-labelledby="dashboard-drilldown-title">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
          <nav
            className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
            aria-label="Navegação estrutural"
          >
            <button
              type="button"
              onClick={closeDrilldown}
              className="font-medium text-primary hover:underline"
            >
              Home
            </button>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium text-foreground">{drilldownLabel}</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="font-semibold text-foreground">{displayDimensionLabel}</span>
          </nav>

          <div className="mt-4 flex items-center justify-between">
            <h1
              id="dashboard-drilldown-title"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {`Drill-down · ${drilldownLabel}`}
            </h1>
            <Button variant="outline" onClick={closeDrilldown} aria-label="Voltar ao resumo">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao resumo
            </Button>
          </div>

          {activeDrilldown.availableDimensions.length > 0 && (
            <div
              className="mt-4 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Seletor de dimensão do drill-down"
            >
              {activeDrilldown.availableDimensions.map((dim) => {
                const isActive = dim.dimension === activeDrilldown.dimension;
                return (
                  <button
                    key={dim.dimension}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => void switchDimension(dim.dimension)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-border'
                    }`}
                  >
                    {localizeKpiLabel(dim.label)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isDrilldownLoading && (
          <Card className="border-dashed text-center">
            <CardHeader>
              <div
                className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
                aria-hidden="true"
              />
              <CardTitle>Carregando drill-down</CardTitle>
            </CardHeader>
          </Card>
        )}

        {!isDrilldownLoading && activeDrilldown.rows.length === 0 && (
          <Card className="border-dashed text-center">
            <CardHeader>
              <CardTitle>Dados insuficientes</CardTitle>
              <CardDescription>
                Não há dados para esta dimensão no período selecionado.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!isDrilldownLoading && activeDrilldown.rows.length > 0 && (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do KPI</CardTitle>
                  <CardDescription>Atual versus anterior</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {activeDrilldown.series.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <p className="text-sm font-semibold text-muted-foreground">
                        {item.label === 'Atual' ? 'Atual' : 'Valor anterior'}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Detalhamento por {displayDimensionLabel}</CardTitle>
                  <CardDescription>Evolução do detalhamento carregado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeDrilldown.rows.map((row) => (
                    <div
                      key={row.period}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-foreground">{row.period}</p>
                        <p className="text-lg font-bold text-foreground">{row.value}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Variação {formatDelta(row.delta)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Itens do drill-down</CardTitle>
                <CardDescription>
                  Top grupos por {displayDimensionLabel.toLowerCase()} retornados pela API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeDrilldown.rows.map((row) => (
                  <div
                    key={row.period}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{row.period}</p>
                      <p className="text-sm text-muted-foreground">
                        Variação {formatDelta(row.delta)}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{row.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </section>
    );
  }

  return (
    <section className="space-y-5" aria-labelledby="dashboard-home-title">
      <div className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${
              isDemoMode
                ? 'border-warning/20 bg-warning/10 text-warning-text'
                : 'border-primary/15 bg-primary/5 text-primary'
            }`}
          >
            {isDemoMode ? 'Demonstração · Dados fictícios para visualização' : 'Painel executivo'}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-semibold text-secondary">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Histórico: últimos 12 meses
          </span>
        </div>
        <h1
          id="dashboard-home-title"
          className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Visão geral
        </h1>
        <p className="mt-3 max-w-4xl text-base leading-7 text-muted-foreground">
          {isDemoMode
            ? 'Evolução fictícia de Produção, Comercial e Algodoeira ao longo dos últimos 12 meses.'
            : 'Indicadores de Produção, Comercial e Algodoeira no período selecionado.'}
        </p>
        {errorMessage ? (
          <p className="mt-3 text-sm font-medium text-danger">{errorMessage}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          icon={BarChart3}
          label="KPIs monitorados"
          value={String(home.summary.totalKpis)}
        />
        <SummaryCard icon={Layers3} label="Áreas cobertas" value={String(heroAreaCount)} />
        <SummaryCard
          icon={TrendingUp}
          label="Variação média"
          value={formatDelta(home.summary.averageDelta)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-primary p-2 shadow-panel">
        <div
          role="tablist"
          aria-label="Modos de visualização dos indicadores"
          className="grid gap-2 sm:grid-cols-3"
        >
          {(Object.entries(TAB_LABELS) as Array<[DashboardTab, string]>).map(([tabId, label]) => {
            const isActive = activeTab === tabId;

            return (
              <button
                key={tabId}
                type="button"
                role="tab"
                aria-label={label}
                aria-selected={isActive}
                aria-controls={`panel-${tabId}`}
                id={`tab-${tabId}`}
                onClick={() => setActiveTab(tabId)}
                className={`rounded-xl px-4 py-3 text-left transition focus-visible:outline-white ${
                  isActive ? 'bg-white text-primary shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                <p className="text-sm font-semibold">{label}</p>
                <p
                  className={`mt-1 text-sm ${isActive ? 'text-muted-foreground' : 'text-white/80'}`}
                >
                  {tabId === 'executiva'
                    ? 'Leitura executiva para decisão rápida'
                    : tabId === 'analitica'
                      ? 'Gráficos comparativos e histórico'
                      : 'Pendências, variações e acompanhamento'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'executiva' ? (
        <section
          id="panel-executiva"
          role="tabpanel"
          aria-labelledby="tab-executiva"
          className="space-y-6"
        >
          <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
            {lineData.length > 0 ? (
              <LineChartWidget
                title="Linha do tempo principal"
                description="Indicador atual em comparação ao período anterior."
                data={lineData}
                xKey="period"
                unit={featuredHistory?.unit ?? 'number'}
                series={[
                  { dataKey: 'atual', name: 'Atual', color: 'hsl(var(--chart-forest))' },
                  {
                    dataKey: 'anterior',
                    name: 'Anterior',
                    color: 'hsl(var(--chart-slate))',
                    strokeDasharray: '6 4',
                  },
                ]}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Linha do tempo principal</CardTitle>
                  <CardDescription>
                    Série histórica ainda indisponível para o indicador em destaque.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Destaques do período</CardTitle>
                <CardDescription>
                  Movimentos que merecem atenção na leitura executiva.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  strongestPositive
                    ? {
                        label: 'Maior avanço',
                        kpi: strongestPositive,
                        icon: TrendingUp,
                        tone: 'positive' as const,
                      }
                    : null,
                  strongestNegative
                    ? {
                        label: strongestNegative.delta < 0 ? 'Maior atenção' : 'Menor variação',
                        kpi: strongestNegative,
                        icon: strongestNegative.delta < 0 ? AlertTriangle : TrendingDown,
                        tone:
                          strongestNegative.delta < 0
                            ? ('negative' as const)
                            : ('neutral' as const),
                      }
                    : null,
                  mostStable
                    ? {
                        label: 'Mais estável',
                        kpi: mostStable,
                        icon: Clock3,
                        tone: 'neutral' as const,
                      }
                    : null,
                ]
                  .filter(
                    (
                      item,
                    ): item is {
                      label: string;
                      kpi: RankedKpi;
                      icon: LucideIcon;
                      tone: 'positive' | 'negative' | 'neutral';
                    } => item !== null,
                  )
                  .map((item) => (
                    <MetricCallout
                      key={item.label}
                      icon={item.icon}
                      title={item.label}
                      value={formatDelta(item.kpi.delta)}
                      description={localizeKpiLabel(item.kpi.title)}
                      tone={item.tone}
                    />
                  ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leitura por área</CardTitle>
              <CardDescription>Indicadores agrupados por frente de negócio.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {home.businessAreas.map((area) => (
                <div
                  key={area.businessArea}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{localizeKpiLabel(area.label)}</p>
                    <p className="text-lg font-bold text-primary">{area.total}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Variação média {formatDelta(area.averageDelta)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {(Object.keys(BUSINESS_AREA_LABEL) as BusinessArea[]).map((businessArea) => {
            const items = groupedKpis.get(businessArea) ?? [];
            if (items.length === 0) {
              return null;
            }

            return (
              <Card key={businessArea}>
                <CardHeader>
                  <CardTitle>{BUSINESS_AREA_LABEL[businessArea]}</CardTitle>
                  <CardDescription>
                    Indicadores desta frente com acesso rápido ao detalhamento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {items.map((kpi) => (
                    <div key={kpi.id} className="space-y-3">
                      <KpiCard
                        kpi={{
                          ...kpi,
                          title: localizeKpiLabel(kpi.title),
                          sector: localizeKpiLabel(kpi.sector),
                        }}
                      />
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => void openDrilldown(kpi.id)}
                        disabled={isDrilldownLoading}
                        aria-label={`Abrir detalhamento de ${localizeKpiLabel(kpi.title)}`}
                      >
                        Abrir detalhamento
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </section>
      ) : null}

      {activeTab === 'analitica' ? (
        <section
          id="panel-analitica"
          role="tabpanel"
          aria-labelledby="tab-analitica"
          className="space-y-6"
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <PieChartWidget
              title="Distribuição por setor"
              description="Participação dos indicadores por setor na visão geral."
              data={distributionData}
              nameKey="sector"
              valueKey="total"
            />
            <BarChartWidget
              title="Variação dos indicadores"
              description="Comparação das principais mudanças do período."
              data={performanceData}
              xKey="title"
              yKey="delta"
              unit="percent"
              color="hsl(var(--chart-teal))"
            />
          </div>

          {lineData.length > 0 ? (
            <LineChartWidget
              title="Série histórica comparativa"
              description="Evolução do indicador em comparação ao período anterior."
              data={lineData}
              xKey="period"
              unit={featuredHistory?.unit ?? 'number'}
              series={[
                { dataKey: 'atual', name: 'Atual', color: 'hsl(var(--chart-forest))' },
                {
                  dataKey: 'anterior',
                  name: 'Anterior',
                  color: 'hsl(var(--chart-slate))',
                  strokeDasharray: '5 5',
                },
              ]}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Série histórica comparativa</CardTitle>
                <CardDescription>
                  Sem série histórica disponível para a comparação visual.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </section>
      ) : null}

      {activeTab === 'operacional' ? (
        <section
          id="panel-operacional"
          role="tabpanel"
          aria-labelledby="tab-operacional"
          className="space-y-6"
        >
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Acompanhamento operacional</CardTitle>
                <CardDescription>
                  Panorama do volume atual, comparação anterior e tendência imediata.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {operationalItems.map((kpi) => (
                  <button
                    key={kpi.id}
                    type="button"
                    onClick={() => void openDrilldown(kpi.id)}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4 text-left transition hover:border-primary/30 hover:bg-white focus-visible:outline-primary"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{localizeKpiLabel(kpi.title)}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {BUSINESS_AREA_LABEL[kpi.businessArea ?? inferBusinessArea(kpi.sector)]} ·{' '}
                        {localizeKpiLabel(kpi.sector)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{formatKpiValue(kpi)}</p>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {formatDelta(kpi.delta)}
                      </p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itens que pedem atenção</CardTitle>
                <CardDescription>
                  Foco rápido nos indicadores com maior variação absoluta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {operationalItems.map((kpi) => (
                  <div key={kpi.id} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-warning/10 p-2 text-warning">
                          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {localizeKpiLabel(kpi.title)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {localizeKpiLabel(kpi.sector)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatDelta(kpi.delta)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}
    </section>
  );
}

type SummaryCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function SummaryCard({ icon: Icon, label, value }: SummaryCardProps) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

type MetricCalloutProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  tone: 'positive' | 'negative' | 'neutral';
};

function MetricCallout({ icon: Icon, title, value, description, tone }: MetricCalloutProps) {
  const toneClasses =
    tone === 'positive'
      ? {
          container: 'border-success/20 bg-success/5',
          icon: 'bg-success/10 text-success',
          value: 'text-success',
        }
      : tone === 'negative'
        ? {
            container: 'border-danger/20 bg-danger/5',
            icon: 'bg-danger/10 text-danger',
            value: 'text-danger',
          }
        : {
            container: 'border-border bg-background',
            icon: 'bg-secondary/10 text-secondary',
            value: 'text-foreground',
          };

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-2xl border p-4 ${toneClasses.container}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className={`rounded-xl p-2 ${toneClasses.icon}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 break-words text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <p className={`shrink-0 text-lg font-bold ${toneClasses.value}`}>{value}</p>
    </div>
  );
}

function inferBusinessArea(sector: string): BusinessArea {
  const normalized = sector.toLowerCase();
  if (normalized.includes('algod')) {
    return 'algodoeira';
  }
  if (normalized.includes('comercial')) {
    return 'comercial';
  }
  return 'producao';
}
