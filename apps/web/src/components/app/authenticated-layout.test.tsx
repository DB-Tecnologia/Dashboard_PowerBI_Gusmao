import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthenticatedLayout } from './authenticated-layout';
import { apiGet } from '@/lib/admin-api';
import * as authApi from '@/lib/auth/api';
import * as session from '@/lib/auth/session';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/app',
}));

jest.mock('@/lib/auth/session', () => ({
  getAuthSession: jest.fn(() => ({
    accessToken: 'access',
    refreshToken: 'refresh',
    tokenType: 'Bearer',
    expiresIn: 900,
  })),
  clearAuthSession: jest.fn(),
}));

jest.mock('@/lib/auth/api', () => ({
  logout: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@/lib/admin-api', () => ({
  apiGet: jest.fn().mockResolvedValue({ roles: ['viewer'], isTwoFactorEnabled: true }),
}));

jest.mock('@/lib/auth/use-inactivity-timeout', () => ({
  useInactivityTimeout: jest.fn(),
}));

describe('AuthenticatedLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar header, sidebar e conteudo', async () => {
    render(
      <AuthenticatedLayout>
        <p>Conteudo da rota</p>
      </AuthenticatedLayout>,
    );

    expect(await screen.findAllByText('Área autenticada')).toHaveLength(2);
    expect(screen.getAllByText('Dashboard Power BI')).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: /Visão geral/i })).toHaveLength(1);
    expect(screen.getByRole('link', { name: /Relatórios/i })).toBeInTheDocument();
    expect(screen.getAllByText('Usuários', { selector: 'span' })).toHaveLength(2);
    expect(screen.getByText('Conteudo da rota')).toBeInTheDocument();
  });

  it('abre e fecha a navegação móvel sem remover os destinos', async () => {
    const user = userEvent.setup();

    render(
      <AuthenticatedLayout>
        <p>Conteudo da rota</p>
      </AuthenticatedLayout>,
    );

    const menuButton = await screen.findByRole('button', { name: 'Abrir navegação' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByRole('button', { name: 'Fechar navegação' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('navigation', { name: 'Navegação móvel' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Visão geral/i })).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Fechar navegação' }));

    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    expect(apiGet).toHaveBeenCalledWith('/auth/me');
  });

  it('deve limpar sessao e redirecionar ao sair', async () => {
    render(
      <AuthenticatedLayout>
        <p>Conteudo da rota</p>
      </AuthenticatedLayout>,
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Sair' }));

    expect(authApi.logout).toHaveBeenCalledWith('refresh', 'access');
    expect(session.clearAuthSession).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/login');
  });
});
