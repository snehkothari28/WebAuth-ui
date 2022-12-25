#!/bin/bash

if test -f nohup.out; then
  rm nohup.out
fi

npm install 

timestamp=$(date "+%Y%m%d%H%M%S")
[ ! -d server-logs ] && mkdir server-logs
[ ! -d server-logs/"$timestamp" ] && mkdir server-logs/"$timestamp"

nohup ng serve --configuration=production --host=0.0.0.0 --disable-host-check > ./server-logs/"$timestamp"/log.txt 2>&1 &
echo $! > save_pid.txt

echo "Running WebAuth-ui server and logging at server-logs/${timestamp}"

pause(5000)
cat ./server-logs/"$timestamp"/log.txt
