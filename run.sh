#!/bin/bash

if test -f nohup.out; then
  rm nohup.out
fi

timestamp=$(date "+%Y%m%d%H%M%S")
mkdir server-logs/timestamp

nohup ng serve --configuration=production --port=4401 1>./server-logs/timestamp/stdout.txt 2>./server-logs/timestamp/stderr.txt &
echo $! > save_pid.txt
