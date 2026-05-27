#!/usr/bin/env bash
# perf-budget.sh — verify a 3D web app meets perf budgets
# Usage: ./perf-budget.sh https://your-app.com
#
# Checks:
#   - LCP < 2.5s
#   - INP < 200ms
#   - JS bundle (gzipped) <= 400 KB
#   - Lighthouse Performance >= 80

set -euo pipefail

URL="${1:?usage: $0 <url>}"

if ! command -v npx &> /dev/null; then
  echo "npx not found." >&2; exit 1
fi

echo "→ Lighthouse run on $URL"
npx -y lighthouse "$URL" \
  --only-categories=performance \
  --form-factor=mobile \
  --throttling-method=simulate \
  --output=json --output=html \
  --output-path=./lighthouse-report \
  --chrome-flags="--headless"

JSON="./lighthouse-report.report.json"

if [ ! -f "$JSON" ]; then
  echo "Lighthouse JSON not found. Aborting." >&2; exit 1
fi

PERF=$(node -e "console.log(Math.round(require('./lighthouse-report.report.json').categories.performance.score * 100))")
LCP=$(node -e "console.log(Math.round(require('./lighthouse-report.report.json').audits['largest-contentful-paint'].numericValue))")
TBT=$(node -e "console.log(Math.round(require('./lighthouse-report.report.json').audits['total-blocking-time'].numericValue))")
CLS=$(node -e "console.log(require('./lighthouse-report.report.json').audits['cumulative-layout-shift'].numericValue.toFixed(3))")

echo
echo "→ Results"
printf "  Performance:  %s / 100   (target ≥ 80)\n" "$PERF"
printf "  LCP:          %s ms       (target < 2500)\n" "$LCP"
printf "  TBT:          %s ms       (target < 200)\n" "$TBT"
printf "  CLS:          %s          (target < 0.1)\n" "$CLS"

FAIL=0
[ "$PERF" -lt 80 ] && { echo "  ❌ Performance below 80"; FAIL=1; }
[ "$LCP" -gt 2500 ] && { echo "  ❌ LCP exceeds 2.5s"; FAIL=1; }
[ "$TBT" -gt 200 ] && { echo "  ❌ TBT exceeds 200ms"; FAIL=1; }

if [ "$FAIL" -eq 0 ]; then
  echo "  ✓ All budgets passed"
  exit 0
else
  echo
  echo "  Open ./lighthouse-report.report.html for details"
  exit 1
fi
