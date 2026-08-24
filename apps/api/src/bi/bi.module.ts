import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SqlServerModule } from '../sql-server/sql-server.module';
import { BiIntegrationController } from './bi-integration.controller';
import { BiIntegrationService } from './bi-integration.service';
import { BiRefreshService } from './bi-refresh.service';

@Module({
  imports: [AuthModule, SqlServerModule],
  controllers: [BiIntegrationController],
  providers: [BiIntegrationService, BiRefreshService],
  exports: [BiIntegrationService, BiRefreshService],
})
export class BiModule {}
