#!/bin/sh

set -e

if [ -z "$ENTRYPOINT_CMD" ]; then
  echo "missing env var ENTRYPOINT_CMD"
  exit 1
fi

cmd="$ENTRYPOINT_CMD"

eval "exec $cmd"
