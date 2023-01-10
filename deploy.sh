#!/bin/sh

BASE_DIR=$HOME/public_html/multitimer-vue
SRC=$BASE_DIR/src
DIST=$BASE_DIR/dist
PUBLIC=$BASE_DIR/public
TARGET_DIR=$HOME/public_html/multitimer-testing

if [ $(hostname) != "zeus.med-web.com" ]; then
    echo Deploying on a system that is not Zeus is deactivated. Exitting. >&2
    exit 1
fi

if [ "$1" == "--release" ]; then
    TARGET_DIR=$HOME/public_html/multitimer
fi

if [ "$1" == "--qa" ]; then
    TARGET_DIR=tbaugher@zeus-qa:/www/docrootssl/public/multitimer
fi

function build() {
    echo Building timer... && \
    npm run build
}

function deploy() {
    echo Deploying... && \
    rsync -r $DIST/* $TARGET_DIR
}

build && \
deploy && \
echo Done!
