#!/bin/bash

if test -f nohup.out; then
  rm nohup.out
fi

npm install 

timestamp=$(date "+%Y%m%d%H%M%S")
[ ! -d server-logs ] && mkdir server-logs
[ ! -d server-logs/"$timestamp" ] && mkdir server-logs/"$timestamp"

nohup ng serve --configuration=production 1>./server-logs/"$timestamp"/stdout.txt 2>./server-logs/"$timestamp"/stderr.txt &
echo $! > save_pid.txt

echo "Running WebAuth-ui server and logging at server-logs/${timestamp}"