#!/bin/sh

env_file="apps/web/build/env.js"

set -e

vexenv=$(env | grep '^VEX_' | cut -d= -f1)
for envvar in $vexenv
do
  envval=$(eval echo "\$$envvar")
  echo "window.vexenv.${envvar#VEX_} = '$envval'," >> "$env_file"
done
