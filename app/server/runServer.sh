#!/usr/bin/env bash

# Ref: <https://stackoverflow.com/a/30969768/151048>.
if [[ -f .env ]]; then
  echo "Found a .env file, loading environment variables from that file."
  set -o allexport
  source .env
fi

(cd target && exec java -jar finance-*.jar)
