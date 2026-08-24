import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/types/auth.types';
import { BiIntegrationService } from './bi-integration.service';
import { StartRefreshDto } from './dto/start-refresh.dto';

@ApiTags('bi-v1')
@ApiBearerAuth()
@Controller('api/v1/bi')
@UseGuards(JwtAuthGuard)
export class BiIntegrationController {
  constructor(private readonly biIntegrationService: BiIntegrationService) {}

  @Get('source')
  @ApiOperation({ summary: 'Retorna a fonte de dados e a saude da conexao.' })
  getSource() {
    return this.biIntegrationService.getSource();
  }

  @Get('freshness')
  @ApiOperation({ summary: 'Retorna frescor, watermark e ultimo snapshot valido.' })
  getFreshness() {
    return this.biIntegrationService.getFreshness();
  }

  @Get('filters')
  @ApiOperation({ summary: 'Retorna o contrato versionado de filtros de BI.' })
  getFilters() {
    return this.biIntegrationService.getFilters();
  }

  @Get('production/summary')
  @ApiOperation({ summary: 'Retorna o resumo de producao com origem e frescor explicitos.' })
  getProductionSummary() {
    return this.biIntegrationService.getDomain('productionSummary');
  }

  @Get('grains')
  getGrains() {
    return this.biIntegrationService.getDomain('grains');
  }

  @Get('cotton')
  getCotton() {
    return this.biIntegrationService.getDomain('cotton');
  }

  @Get('ginning')
  getGinning() {
    return this.biIntegrationService.getDomain('ginning');
  }

  @Get('romaneios')
  getRomaneios() {
    return this.biIntegrationService.getDomain('romaneios');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Valida a fonte e registra uma execucao idempotente de atualizacao.' })
  startRefresh(@Body() body: StartRefreshDto, @CurrentUser() user: AuthenticatedRequestUser) {
    return this.biIntegrationService.startRefresh(body.idempotencyKey, user.email);
  }

  @Get('refresh/:runId')
  @ApiOperation({ summary: 'Retorna o status e as contagens de uma execucao de atualizacao.' })
  getRefresh(@Param('runId') runId: string) {
    return this.biIntegrationService.getRefresh(runId);
  }
}
