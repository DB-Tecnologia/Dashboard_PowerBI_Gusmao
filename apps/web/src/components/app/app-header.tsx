import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui';

import { LogoutButton } from './logout-button';

type AppHeaderProps = {
  isMobileNavigationOpen: boolean;
  onMobileNavigationToggle: () => void;
};

export function AppHeader({ isMobileNavigationOpen, onMobileNavigationToggle }: AppHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 px-0 lg:hidden"
          aria-label={isMobileNavigationOpen ? 'Fechar navegação' : 'Abrir navegação'}
          aria-expanded={isMobileNavigationOpen}
          aria-controls="mobile-navigation-panel"
          onClick={onMobileNavigationToggle}
        >
          {isMobileNavigationOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Dashboard Power BI</p>
          <p className="text-xs text-muted-foreground">Área autenticada</p>
        </div>
      </div>
      <LogoutButton />
    </header>
  );
}
