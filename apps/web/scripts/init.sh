#!/bin/sh

set -e

if [ -z "$WEB_ENV_FILE" ]; then
  echo "missing env var WEB_ENV_FILE"
  exit 1
fi

env_file="$WEB_ENV_FILE"

vexenv=$(env | grep '^VEX_' | cut -d= -f1)
for envvar in $vexenv
do
  envval=$(eval echo "\$$envvar")
  echo "window.vexenv.${envvar#VEX_} = '$envval'," >> "$env_file"
done
