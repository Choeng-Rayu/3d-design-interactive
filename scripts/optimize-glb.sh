#!/usr/bin/env bash
# optimize-glb.sh — compress a GLB/glTF for web delivery
# Usage: ./optimize-glb.sh input.glb [output.glb]
#
# Pipeline: meshopt geometry + KTX2/WebP textures + simplification (75%).
# Typical savings: 70-90% file size.

set -euo pipefail

INPUT="${1:?usage: $0 input.glb [output.glb]}"
OUTPUT="${2:-${INPUT%.*}.optimized.glb}"

if ! command -v pnpm &> /dev/null; then
  echo "pnpm not found. Install: npm i -g pnpm" >&2
  exit 1
fi

echo "→ Optimizing $INPUT"
echo "  meshopt + WebP textures + 75% simplification"

pnpm dlx @gltf-transform/cli optimize "$INPUT" "$OUTPUT" \
  --texture-compress webp \
  --texture-resize 2048 \
  --simplify \
  --simplify-ratio 0.75 \
  --simplify-error 0.01

echo
echo "→ Sizes:"
du -h "$INPUT" "$OUTPUT" | awk '{ printf "  %s  %s\n", $1, $2 }'

INPUT_BYTES=$(stat -c %s "$INPUT" 2>/dev/null || stat -f %z "$INPUT")
OUTPUT_BYTES=$(stat -c %s "$OUTPUT" 2>/dev/null || stat -f %z "$OUTPUT")
SAVINGS=$(awk "BEGIN { printf \"%.1f\", (1 - $OUTPUT_BYTES / $INPUT_BYTES) * 100 }")
echo "  Savings: $SAVINGS%"

echo
echo "→ Inspect at https://gltf.report/"
