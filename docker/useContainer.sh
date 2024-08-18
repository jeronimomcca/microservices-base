#!/bin/bash

# start the container and map the current directory to /app
function start() {
    docker run -it -p 3000:3000 -p 10000:10000 -v "$(pwd)":/app --name node-container node:16 bash
}

# open a new terminal in the running container
function go() {
    docker exec -it node-container bash
}

# parse the command line arguments and call the appropriate function
if [ "$1" == "start" ]; then
    start
elif [ "$1" == "go" ]; then
    go
else
    echo "Usage: node-container [start|go]"
fi
