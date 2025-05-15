#!/usr/bin/env bash
set -euo pipefail
export TERM=${TERM:-dumb}
if [[ -t 1 ]]; then clear; fi

sh ./clean.sh || exit 1

dirs=(std runtime dom dsp box box-forge jsx fusion)
for dir in "${dirs[@]}"; do
  echo "install $dir"
  (cd "$dir" && npm install) || exit 1
done

for dir in "${dirs[@]}"; do
  echo "build $dir"
  (cd "$dir" && npm run build) || exit 1
done

for dir in "${dirs[@]}"; do
  echo "test $dir"
  (cd "$dir" && npm run test)  || exit 1
done

echo "done"
