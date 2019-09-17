#!/bin/bash
cd $(dirname $0)

set -e
dropdb carly24 2>/dev/null || true
createdb carly24
psql -1Xv ON_ERROR_STOP=1 -f schema.sql -f data.sql carly24

echo "✅ DB reset"
