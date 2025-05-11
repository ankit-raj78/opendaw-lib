#!/bin/bash
clear
set -e
sh ./clean.sh || exit 1

dirs=(std runtime dom dsp box box-forge tsx)   # topological sorted by dependency

for dir in "${dirs[@]}"; do
  echo "install $dir"
  (cd "$dir" && npm install) || exit 1
done

for dir in "${dirs[@]}"; do
  echo "build $dir"
  (cd "$dir" && npm run build) || exit 1
done

echo "done"