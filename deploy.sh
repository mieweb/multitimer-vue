#!/bin/sh

DIST="./dist"

if [ $(hostname) != "zeus.med-web.com" ]; then
    echo Deploying on a system that is not Zeus is deactivated. Exitting. >&2
    exit 1
fi

function usage() {
    echo "Usage: deploy.sh [ --testing | --zeus | --qa ]"
}

if [ "$#" != "1" ]; then
    usage
    exit 1
fi

case "$1" in
    "--testing")
        TARGET_DIR=$HOME/public_html/multitimer-testing
        ;;
    "--zeus")
        TARGET_DIR=$HOME/public_html/multitimer
        ;;
    "--qa")
        TARGET_DIR=tbaugher@zeus-qa:/www/docrootssl/public/multitimer
        ;;
    *)
        usage
        exit 1
        ;;
esac

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
