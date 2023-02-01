#!/bin/bash

read_var() {
    VAR=$(grep $1 $2 | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

SSH_PORT=$(read_var SSH_PORT .secrets)
SSH_IP=$(read_var SSH_IP .secrets)
REMOTE_DESTINATION=$(read_var REMOTE_DESTINATION .secrets)

scp -P $SSH_PORT -r build/ $SSH_IP:$REMOTE_DESTINATION