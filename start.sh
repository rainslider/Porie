#!/bin/sh
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Installeer eerst Node.js: https://nodejs.org"; exit 1; }
echo "Open http://localhost:${PORT:-3000}"
exec node server.js
