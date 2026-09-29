'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Bell,
  ChartBar as BarChart3,
  Download,
  LayoutDashboard,
  Settings,
  Star,
  UserCog,
  Users,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  {
    href: '/app',
    label: 'Visão geral',
    description: 'Dashboard com KPIs e indicadores.',
    icon: LayoutDashboard,
  },
  {
    href: '/app/reports',
    label: 'Relatórios',
    description: 'Catálogo de dashboards e consultas.',
    icon: BarChart3,
  },
  {
    href: '/app/dashboards',
    label: 'Personalizados',
    description: 'Dashboards, favoritos e atalhos do usuário.',
    icon: Star,
  },
  {
    href: '/app/exports',
    label: 'Exportações',
    description: 'Histórico de arquivos PDF e Excel.',
    icon: Download,
  },
  {
    href: '/app/notifications',
    label: 'Notificações',
    description: 'Alertas e avisos importantes.',
    icon: Bell,
  },
  {
    href: '/app/admin/users',
    label: 'Usuários',
    description: 'Gerenciamento de usuários.',
    icon: UserCog,
  },
  {
    href: '/app/admin/groups',
    label: 'Grupos',
    description: 'Grupos de acesso e permissões.',
    icon: Users,
  },
  {
    href: '/app/admin/settings',
    label: 'Configurações',
    description: 'Parâmetros gerais do sistema.',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-primary px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
      <div className="mb-8 px-3">
        <p className="text-base font-bold tracking-tight text-white">Dashboard Power BI</p>
        <p className="mt-1 text-sm text-white/80">Área autenticada</p>
      </div>
      <NavigationLinks label="Navegação autenticada" />
    </aside>
  );
}

type AppMobileNavigationProps = {
  isOpen: boolean;
  onNavigate: () => void;
};

export function AppMobileNavigation({ isOpen, onNavigate }: AppMobileNavigationProps) {
  return (
    <div
      id="mobile-navigation-panel"
      className="border-b border-border bg-primary px-4 py-4 lg:hidden"
      hidden={!isOpen}
    >
      <NavigationLinks label="Navegação móvel" onNavigate={onNavigate} />
    </div>
  );
}

function NavigationLinks({ label, onNavigate }: { label: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="space-y-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-white ${
              isActive
                ? 'border-white/25 bg-secondary text-white'
                : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-0.5 block text-sm leading-5 text-white">{item.description}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
