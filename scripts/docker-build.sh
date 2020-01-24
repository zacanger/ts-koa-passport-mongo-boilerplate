#!/usr/bin/env bash
set -e

version=$(git describe --exact 2>/dev/null || git rev-parse --short=10 HEAD)

docker build -t foo/auth:$version .
