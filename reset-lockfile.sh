#!/bin/bash
rm -f pnpm-lock.yaml
pnpm install
git add package.json pnpm-lock.yaml
git commit -m "Fix package.json versions and regenerate lockfile"
git push
