IF DB_ID(N'__DB_NAME__') IS NULL
BEGIN
  CREATE DATABASE [__DB_NAME__];
END
GO

USE [__DB_NAME__];
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'reports')
BEGIN
  EXEC('CREATE SCHEMA reports');
END
GO

IF OBJECT_ID(N'reports.financeiro_resumo', N'U') IS NULL
BEGIN
  CREATE TABLE reports.financeiro_resumo (
    id INT NOT NULL PRIMARY KEY,
    indicador NVARCHAR(120) NOT NULL,
    valor DECIMAL(18,2) NOT NULL,
    competencia DATE NOT NULL
  );
END
GO

IF OBJECT_ID(N'reports.comercial_pipeline', N'U') IS NULL
BEGIN
  CREATE TABLE reports.comercial_pipeline (
    id INT NOT NULL PRIMARY KEY,
    regional NVARCHAR(40) NOT NULL,
    cliente NVARCHAR(120) NOT NULL,
    valor DECIMAL(18,2) NOT NULL,
    etapa NVARCHAR(40) NOT NULL
  );
END
GO

IF OBJECT_ID(N'reports.operacoes_status', N'U') IS NULL
BEGIN
  CREATE TABLE reports.operacoes_status (
    id INT NOT NULL PRIMARY KEY,
    status NVARCHAR(20) NOT NULL,
    fila NVARCHAR(80) NOT NULL,
    sla_percentual DECIMAL(5,2) NOT NULL
  );
END
GO

IF OBJECT_ID(N'reports.diretoria_estrategica', N'U') IS NULL
BEGIN
  CREATE TABLE reports.diretoria_estrategica (
    id INT NOT NULL PRIMARY KEY,
    indicador NVARCHAR(120) NOT NULL,
    valor NVARCHAR(120) NOT NULL
  );
END
GO

DELETE FROM reports.financeiro_resumo;
WITH periodos AS (
  SELECT *
  FROM (VALUES
    (1, DATEADD(MONTH, -11, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 96500.00, 28.10, 5.10),
    (2, DATEADD(MONTH, -10, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 101200.00, 29.40, 4.90),
    (3, DATEADD(MONTH, -9, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 108300.00, 30.20, 4.70),
    (4, DATEADD(MONTH, -8, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 104800.00, 29.80, 4.80),
    (5, DATEADD(MONTH, -7, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 112600.00, 31.10, 4.60),
    (6, DATEADD(MONTH, -6, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 118900.00, 31.50, 4.40),
    (7, DATEADD(MONTH, -5, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 115400.00, 30.80, 4.50),
    (8, DATEADD(MONTH, -4, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 123700.00, 32.20, 4.20),
    (9, DATEADD(MONTH, -3, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 120000.00, 32.00, 4.50),
    (10, DATEADD(MONTH, -2, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 128500.00, 32.60, 4.10),
    (11, DATEADD(MONTH, -1, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1)), 132100.00, 33.10, 3.90),
    (12, DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1), 137800.00, 33.40, 3.80)
  ) AS dados(mes, competencia, receita, margem, inadimplencia)
), indicadores AS (
  SELECT *
  FROM (VALUES
    (1, N'Receita recorrente'),
    (2, N'Margem operacional'),
    (3, N'Inadimplência')
  ) AS dados(ordem, indicador)
)
INSERT INTO reports.financeiro_resumo (id, indicador, valor, competencia)
SELECT
  periodos.mes * 10 + indicadores.ordem,
  indicadores.indicador,
  CASE indicadores.ordem
    WHEN 1 THEN periodos.receita
    WHEN 2 THEN periodos.margem
    ELSE periodos.inadimplencia
  END,
  periodos.competencia
FROM periodos
CROSS JOIN indicadores;
GO

DELETE FROM reports.comercial_pipeline;
INSERT INTO reports.comercial_pipeline (id, regional, cliente, valor, etapa) VALUES
  (1, N'Sudeste', N'Cliente Demo 01', 45000.00, N'Proposta'),
  (2, N'Sul', N'Cliente Demo 02', 32000.00, N'Negociação'),
  (3, N'Centro-Oeste', N'Cliente Demo 03', 15000.00, N'Fechamento'),
  (4, N'Norte', N'Cliente Demo 04', 68000.00, N'Qualificação'),
  (5, N'Sudeste', N'Cliente Demo 05', 52000.00, N'Fechamento'),
  (6, N'Sul', N'Cliente Demo 06', 27000.00, N'Proposta'),
  (7, N'Centro-Oeste', N'Cliente Demo 07', 84000.00, N'Negociação'),
  (8, N'Norte', N'Cliente Demo 08', 19000.00, N'Qualificação'),
  (9, N'Sudeste', N'Cliente Demo 09', 73000.00, N'Negociação'),
  (10, N'Sul', N'Cliente Demo 10', 38000.00, N'Fechamento'),
  (11, N'Centro-Oeste', N'Cliente Demo 11', 61000.00, N'Proposta'),
  (12, N'Norte', N'Cliente Demo 12', 44000.00, N'Negociação'),
  (13, N'Sudeste', N'Cliente Demo 13', 92000.00, N'Qualificação'),
  (14, N'Sul', N'Cliente Demo 14', 56000.00, N'Proposta'),
  (15, N'Centro-Oeste', N'Cliente Demo 15', 33000.00, N'Fechamento'),
  (16, N'Norte', N'Cliente Demo 16', 77000.00, N'Negociação'),
  (17, N'Sudeste', N'Cliente Demo 17', 25000.00, N'Qualificação'),
  (18, N'Sul', N'Cliente Demo 18', 88000.00, N'Proposta');
GO

DELETE FROM reports.operacoes_status;
INSERT INTO reports.operacoes_status (id, status, fila, sla_percentual) VALUES
  (1, N'ativo', N'Plantio', 94.50),
  (2, N'ativo', N'Colheita', 91.20),
  (3, N'pausado', N'Beneficiamento', 78.00),
  (4, N'concluido', N'Classificação', 98.10),
  (5, N'pendente', N'Expedição', 82.30),
  (6, N'ativo', N'Armazenagem', 93.40),
  (7, N'concluido', N'Pesagem', 99.20),
  (8, N'ativo', N'Transporte', 88.60),
  (9, N'pausado', N'Manutenção', 76.40),
  (10, N'pendente', N'Faturamento', 85.70),
  (11, N'ativo', N'Qualidade', 95.80),
  (12, N'concluido', N'Conferência', 97.50);
GO

DELETE FROM reports.diretoria_estrategica;
INSERT INTO reports.diretoria_estrategica (id, indicador, valor) VALUES
  (1, N'Projetos ativos', N'18'),
  (2, N'Exportações concluídas', N'240'),
  (3, N'SLA médio', N'92%'),
  (4, N'Área plantada demonstrativa', N'14820 ha'),
  (5, N'Área colhida demonstrativa', N'11360 ha'),
  (6, N'Contratos ativos demonstrativos', N'186'),
  (7, N'Volume entregue demonstrativo', N'4280 t'),
  (8, N'Fardos beneficiados demonstrativos', N'68400'),
  (9, N'Unidades operacionais demonstrativas', N'4'),
  (10, N'Relatórios disponíveis', N'4'),
  (11, N'Alertas demonstrativos', N'3'),
  (12, N'Atualização', N'Dados fictícios');
GO

CREATE OR ALTER VIEW reports.vw_financeiro_resumo AS
SELECT id, indicador, valor, competencia
FROM reports.financeiro_resumo;
GO

CREATE OR ALTER VIEW reports.vw_comercial_pipeline AS
SELECT id, regional, cliente, valor, etapa
FROM reports.comercial_pipeline;
GO

CREATE OR ALTER VIEW reports.vw_diretoria_estrategica AS
SELECT id, indicador, valor
FROM reports.diretoria_estrategica;
GO

CREATE OR ALTER PROCEDURE reports.sp_operacoes_status
  @status NVARCHAR(20) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  SELECT id, status, fila, sla_percentual
  FROM reports.operacoes_status
  WHERE @status IS NULL OR status = @status
  ORDER BY id;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'dashboard_reader')
BEGIN
  CREATE LOGIN [dashboard_reader] WITH PASSWORD = N'__APP_PASSWORD__', CHECK_POLICY = ON, CHECK_EXPIRATION = OFF;
END
GO

IF DATABASE_PRINCIPAL_ID(N'dashboard_reader') IS NULL
BEGIN
  CREATE USER [dashboard_reader] FOR LOGIN [dashboard_reader];
END
GO

ALTER ROLE [db_datareader] ADD MEMBER [dashboard_reader];
GRANT EXECUTE ON SCHEMA::[reports] TO [dashboard_reader];
GO
