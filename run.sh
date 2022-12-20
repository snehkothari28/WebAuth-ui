#!/bin/bash

rm nohup.out
nohup ng serve --configuration=production --port=4401 1>./server-logs/stdout.txt 2>./server-logs/stderr.txt &
echo $! > save_pid.txt
