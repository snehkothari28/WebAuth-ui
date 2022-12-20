#!/bin/bash

rm nohup.out
nohup ng serve --configuration=production --port=4401 &
echo $! > save_pid.txt
