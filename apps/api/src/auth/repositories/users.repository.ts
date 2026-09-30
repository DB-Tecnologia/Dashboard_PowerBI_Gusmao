import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';

import { AuthUser, SectorCode, UserRole } from '../types/auth.types';

export type CreateUserInput = {
  id: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  sectors: SectorCode[];
  groupIds?: string[];
};

export type UpdateUserInput = Partial<
  Pick<
    AuthUser,
    | 'email'
    | 'roles'
    | 'sectors'
    | 'groupIds'
    | 'isActive'
    | 'passwordHash'
    | 'totpSecret'
    | 'isTwoFactorEnabled'
    | 'tokenVersion'
  >
>;

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  private readonly usersByEmail = new Map<string, AuthUser>();
  private readonly usersById = new Map<string, AuthUser>();

  constructor(private readonly configService: ConfigService) {
    this.seedDevelopmentUsers();
  }

  async findAll(): Promise<AuthUser[]> {
    return Array.from(this.usersByEmail.values());
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.usersByEmail.get(email.toLowerCase()) ?? null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    return this.usersById.get(id) ?? null;
  }

  async create(input: CreateUserInput): Promise<AuthUser> {
    const now = new Date();
    const user: AuthUser = {
      id: input.id,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      roles: input.roles,
      sectors: input.sectors,
      groupIds: input.groupIds ?? [],
      isActive: true,
      totpSecret: null,
      isTwoFactorEnabled: false,
      tokenVersion: 0,
      createdAt: now,
      updatedAt: now,
      deactivatedAt: null,
    };

    this.usersByEmail.set(user.email, user);
    this.usersById.set(user.id, user);

    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<AuthUser | null> {
    const current = this.usersById.get(id);

    if (!current) {
      return null;
    }

    if (input.email && input.email.toLowerCase() !== current.email) {
      this.usersByEmail.delete(current.email);
    }

    const next: AuthUser = {
      ...current,
      ...input,
      email: (input.email ?? current.email).toLowerCase(),
      updatedAt: new Date(),
      deactivatedAt:
        input.isActive === false
          ? (current.deactivatedAt ?? new Date())
          : input.isActive === true
            ? null
            : current.deactivatedAt,
    };

    this.usersByEmail.set(next.email, next);
    this.usersById.set(next.id, next);

    return next;
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.update(id, { passwordHash });
  }

  async deactivate(id: string): Promise<AuthUser | null> {
    return this.update(id, { isActive: false });
  }

  async updateTotpSecret(id: string, totpSecret: string | null): Promise<void> {
    await this.update(id, { totpSecret });
  }

  async enableTotp(id: string): Promise<void> {
    await this.update(id, { isTwoFactorEnabled: true });
  }

  async disableTotp(id: string): Promise<void> {
    await this.update(id, { isTwoFactorEnabled: false, totpSecret: null });
  }

  async incrementTokenVersion(id: string): Promise<number> {
    const current = this.usersById.get(id);

    if (!current) {
      return 0;
    }

    const nextVersion = current.tokenVersion + 1;
    await this.update(id, { tokenVersion: nextVersion });

    return nextVersion;
  }

  private seedDevelopmentUsers(): void {
    const email = this.configService.get<string>('AUTH_DEMO_USER_EMAIL');
    const password = this.configService.get<string>('AUTH_DEMO_USER_PASSWORD');

    if (!email || !password) {
      return;
    }

    if (this.configService.get<string>('AUTH_DEMO_VIEWER_ONLY') === 'true') {
      this.addUser(
        'demo-viewer-preview',
        email,
        password,
        ['viewer'],
        ['diretoria', 'financeiro', 'comercial', 'operacoes'],
      );
      return;
    }

    this.addUser(
      'demo-admin',
      email,
      password,
      ['admin'],
      ['diretoria', 'financeiro', 'comercial', 'operacoes'],
    );

    this.enableDemoAdmin2FA('demo-admin');
    this.addUser(
      'demo-viewer-financeiro',
      'viewer.financeiro@example.com',
      password,
      ['viewer'],
      ['financeiro'],
    );
    this.addUser(
      'demo-downloader-financeiro',
      'downloader.financeiro@example.com',
      password,
      ['downloader'],
      ['financeiro'],
    );
    this.addUser(
      'demo-viewer-comercial',
      'viewer.comercial@example.com',
      password,
      ['viewer'],
      ['comercial'],
    );
    this.addUser(
      'demo-viewer-diretoria',
      'viewer.diretoria@example.com',
      password,
      ['viewer'],
      ['diretoria', 'financeiro', 'comercial', 'operacoes'],
    );
  }

  private addUser(
    id: string,
    email: string,
    password: string,
    roles: UserRole[],
    sectors: SectorCode[],
  ): void {
    const saltRounds = Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 12));
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    const now = new Date();
    const user: AuthUser = {
      id,
      email: email.toLowerCase(),
      passwordHash,
      roles,
      sectors,
      groupIds: [],
      isActive: true,
      totpSecret: null,
      isTwoFactorEnabled: false,
      tokenVersion: 0,
      createdAt: now,
      updatedAt: now,
      deactivatedAt: null,
    };

    this.usersByEmail.set(user.email, user);
    this.usersById.set(user.id, user);
  }

  private enableDemoAdmin2FA(userId: string): void {
    const user = this.usersById.get(userId);
    if (!user) {
      return;
    }

    const DEMO_TOTP_SECRET = 'JBSWY3DPEHPK3PXP';
    const now = Math.floor(Date.now() / 1000);
    const counter = Math.floor(now / 30);
    const code = this.generateTotpCode(DEMO_TOTP_SECRET, counter);

    this.usersById.set(userId, {
      ...user,
      totpSecret: DEMO_TOTP_SECRET,
      isTwoFactorEnabled: true,
    });
    this.usersByEmail.set(user.email, {
      ...user,
      totpSecret: DEMO_TOTP_SECRET,
      isTwoFactorEnabled: true,
    });

    this.logger.warn(
      `[DEV] 2FA pré-ativado para admin demo. Secret: ${DEMO_TOTP_SECRET}. Código atual: ${code}. Use Google Authenticator com este secret ou o código exibido.`,
    );
  }

  private generateTotpCode(secret: string, counter: number): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const map = new Map<string, number>();
    for (let i = 0; i < alphabet.length; i++) {
      map.set(alphabet.charAt(i), i);
    }

    let bits = 0;
    let value = 0;
    const output: number[] = [];

    for (const char of secret.toUpperCase()) {
      const val = map.get(char);
      if (val === undefined) continue;
      value = (value << 5) | val;
      bits += 5;
      if (bits >= 8) {
        output.push((value >>> (bits - 8)) & 0xff);
        bits -= 8;
      }
    }

    const secretBytes = Buffer.from(output);
    const counterBuffer = Buffer.alloc(8);
    const high = Math.floor(counter / 0x100000000);
    const low = counter % 0x100000000;
    counterBuffer.writeUInt32BE(high, 0);
    counterBuffer.writeUInt32BE(low, 4);

    const hmac = createHmac('sha1', secretBytes);
    hmac.update(counterBuffer);
    const digest = hmac.digest();

    const offset = digest.at(-1)! & 0x0f;
    const code =
      ((digest.at(offset)! & 0x7f) << 24) |
      ((digest.at(offset + 1)! & 0xff) << 16) |
      ((digest.at(offset + 2)! & 0xff) << 8) |
      (digest.at(offset + 3)! & 0xff);

    return (code % 1_000_000).toString().padStart(6, '0');
  }
}
