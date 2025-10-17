#!/bin/sh

set -e

if [ -z "$ENV_FILE" ]; then
  echo "missing env var ENV_FILE"
  exit 1
fi

if [ -z "$ENTRYPOINT_CMD" ]; then
  echo "missing env var ENTRYPOINT_CMD"
  exit 1
fi

env_file="$ENV_FILE"
cmd="$ENTRYPOINT_CMD"

vex_env=$(env | grep '^VEX_' | cut -d= -f1)
for env_var in $vex_env
do
  env_val=$(eval echo "\$$env_var")
  echo "window.vex_env.${env_var#VEX_} = '$env_val'," >> "$env_file"
done

eval "exec $cmd"
