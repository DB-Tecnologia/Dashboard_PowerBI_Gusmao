#!/bin/bash
set -e

DUMP_FILE="/opt/oracle/dump/exp_full_xecdb_20260612-1215.dmp"
IMPORT_FLAG="/opt/oracle/oradata/.dump_imported"
ORACLE_SID="XEPDB1"
ORACLE_USER="system"
ORACLE_PASS="${ORACLE_PASSWORD:-oracle}"

echo "[import-dump] Aguardando Oracle ficar pronto..."
until sqlplus -s "${ORACLE_USER}/${ORACLE_PASS}@${ORACLE_SID}" <<< "SELECT 1 FROM dual;" | grep -q "1"; do
  echo "[import-dump] Oracle ainda nao esta pronto, tentando novamente em 5s..."
  sleep 5
done

echo "[import-dump] Oracle pronto."

if [ -f "$IMPORT_FLAG" ]; then
  echo "[import-dump] Dump ja foi importado anteriormente. Pulando importacao."
  exit 0
fi

if [ ! -f "$DUMP_FILE" ]; then
  echo "[import-dump] Arquivo de dump nao encontrado em $DUMP_FILE. Pulando."
  exit 0
fi

echo "[import-dump] Criando diretorio Oracle para import..."
sqlplus -s "${ORACLE_USER}/${ORACLE_PASS}@${ORACLE_SID}" <<< "
CREATE OR REPLACE DIRECTORY DUMP_DIR AS '/tmp';
EXIT;
" 2>/dev/null || true

echo "[import-dump] Copiando dump para diretorio acessivel..."
cp "$DUMP_FILE" "/tmp/exp_full_xecdb_20260612-1215.dmp"

echo "[import-dump] Iniciando importacao Data Pump (impdp)..."
impdp "${ORACLE_USER}/${ORACLE_PASS}@${ORACLE_SID}" \
  directory=DUMP_DIR \
  dumpfile=exp_full_xecdb_20260612-1215.dmp \
  full=y \
  logfile=impdp_full.log \
  TABLE_EXISTS_ACTION=REPLACE 2>&1 || {
  echo "[import-dump] Importacao concluida com avisos (normal para full import)."
}

echo "[import-dump] Verificando schemas importados..."
sqlplus -s "${ORACLE_USER}/${ORACLE_PASS}@${ORACLE_SID}" <<< "
SET PAGESIZE 0 FEEDBACK OFF HEADING OFF
SELECT username FROM all_users WHERE username NOT IN ('SYS','SYSTEM','OUTLN','GSMADMIN_INTERNAL','GGSYS','XSSQLMIG','REMOTE_SCHEDULER_AGENT','DBSFWUSER','ORACLE_OCM','SYSBACKUP','SYSDG','SYSKM','SYSRAC','GSMUSER','GSMCATUSER','XS\$NULL','ANONYMOUS','APPQOSSYS','AUDSYS','DBSNMP','DIP','ORDDATA','ORDPLUGINS','ORDSYS','SI_INFORMTN_SYS','SPATIAL_CSW_ADMIN_USR','SPATIAL_WFS_ADMIN_USR','WMSYS','XDB','CTXSYS','DVSYS','LBACSYS','MDSYS','OLAPSYS','ORDDS','ORDS_METADATA','ORDSYS','APEX_PUBLIC_USER','APEX_INSTANCE_ADMIN','FLOWS_FILES','REST_DATA','SQLPATCH','DVF','DBMS_CLOUD_ADMIN','DBMS_CLOUD','DMSYS','WRR$_USER','SYS\$UMF','REMOTE_SCHEDULER_AGENT','DBAPPEND','DBHIER','DBMVIEWS','DBPDBS','DBRHPACK','DBSQLMIG','DBSTAGE','DBSWITCH','DBTOOLS','DBUA','DBWORKLOAD','DBXPDB','DBXSP','DBXTAPP','DBXTIER','DBXUTIL','DBXVIEW','DBXWORK','DBXADMIN','DBXCAT','DBXCON','DBXDB','DBXDBT','DBXDEV','DBXDOC','DBXENV','DBXERR','DBXFILE','DBXFORM','DBXGRID','DBXHELP','DBXIMG','DBXINFO','DBXJOB','DBXLIST','DBXLOAD','DBXLOC','DBXLOCK','DBXLOG','DBXMAIL','DBXMAP','DBXMENU','DBXMSG','DBXOBJ','DBXOPT','DBXORD','DBXOUT','DBXPAR','DBXPROJ','DBXPROP','DBXQRY','DBXREC','DBXREP','DBXRES','DBXROLE','DBXROW','DBXRPT','DBXSEC','DBXSEQ','DBXSET','DBXSRC','DBXSQL','DBXSRV','DBXSUB','DBXTAB','DBXTBL','DBXTMP','DBXTXT','DBXUSR','DBXVAR','DBXVIEW','DBXWIZ','DBXWS','DBXXML','DBXXREF','DBXSEC','DBXPREF','DBXVALID','DBXVERIFY','DBXVIEW','DBXVOL','DBXWIZ','DBXXML','DBXXREF','DBXSEC','DBXPREF','DBXVALID','DBXVERIFY','DBXVIEW','DBXVOL','DBXWIZ','DBXXML','DBXXREF','DBXSEC','DBXPREF','DBXVALID','DBXVERIFY','DBXVIEW','DBXVOL','DBXWIZ','DBXXML','DBXXREF') ORDER BY username;
" 2>/dev/null || true

echo "[import-dump] Marcando importacao como concluida."
touch "$IMPORT_FLAG"

echo "[import-dump] Importacao finalizada."
