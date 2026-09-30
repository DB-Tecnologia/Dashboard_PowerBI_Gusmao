#!/bin/bash
set -euo pipefail

PASSWORD="${MSSQL_SA_PASSWORD:-${SA_PASSWORD:-}}"
DATABASE_NAME="${SQLSERVER_DATABASE:-DashboardPowerBI}"
APP_PASSWORD="${SQLSERVER_APP_PASSWORD:-$(head -c 48 /dev/urandom | base64 | tr '+/' '-_' | tr -d '=\n')}"

if [[ -z "$PASSWORD" ]]; then
  echo "MSSQL_SA_PASSWORD precisa estar definida." >&2
  exit 1
fi

/opt/mssql/bin/sqlservr &
SQL_PID=$!

until sqlcmd -S localhost -U sa -P "$PASSWORD" -C -Q "SELECT 1" >/dev/null 2>&1; do
  sleep 2
done

sed -e "s/__DB_NAME__/${DATABASE_NAME}/g" \
  -e "s/__APP_PASSWORD__/${APP_PASSWORD}/g" \
  /docker-entrypoint-initdb.d/init-demo.sql > /tmp/init-demo.sql
sqlcmd -S localhost -U sa -P "$PASSWORD" -C -i /tmp/init-demo.sql

wait "$SQL_PID"
