#!/bin/bash

echo "clean"
declare -a targets=("dist" "node_modules" "package-lock.json")
remove_targets() {
  for target in "${targets[@]}"; do
    find . -name "$target" -exec rm -rf {} +
  done
}
remove_targets