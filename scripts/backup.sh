#!/bin/bash
# /home/deploy/scripts/backup.sh — runs daily at 3AM PHT via cron
# Crontab: 0 19 * * * /home/deploy/scripts/backup.sh (19:00 UTC = 3AM PHT)
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/tmp/db_backup_${TIMESTAMP}.sql.gz"

# Dump and compress
pg_dump rentrayda_prod | gzip > "$BACKUP_FILE"

# Upload to R2
aws s3 cp "$BACKUP_FILE" "s3://rentrayda-backups/db/${TIMESTAMP}.sql.gz" \
  --endpoint-url "$R2_ENDPOINT"

# Cleanup local
rm "$BACKUP_FILE"

# Delete backups older than 14 days
aws s3 ls "s3://rentrayda-backups/db/" --endpoint-url "$R2_ENDPOINT" | \
  awk '{print $4}' | head -n -14 | \
  xargs -I{} aws s3 rm "s3://rentrayda-backups/db/{}" --endpoint-url "$R2_ENDPOINT"

echo "Backup complete: ${TIMESTAMP}"
