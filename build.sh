#!/bin/bash

# https://github.com/gohugoio/hugo/releases
HUGO_VER=0.104.3
TAR_NAME=hugo_extended_"$HUGO_VER"_Linux-64bit.tar.gz
DIST_DIR=dist/

HUGO_BIN=bin/hugo
HUGO_URL=https://github.com/gohugoio/hugo/releases/download/v"$HUGO_VER"/"$TAR_NAME"

echo "WorkDir:  $(pwd)"
echo "Command:  $COMMAND"

echo "================================"
echo "Downloading Hugo"
echo "================================"
echo "System:   $(uname -a)"
if [ -e $HUGO_BIN ]; then
    echo "Found '$HUGO_BIN', Noting To Do!"
    echo "Version:  $($HUGO_BIN version)"
else
    echo "Hugo Not Found!"
    echo "Download $HUGO_URL"
    mkdir -p bin &&\
    curl -fL $HUGO_URL -o bin/$TAR_NAME &&\
    tar -xzf bin/$TAR_NAME -C bin &&\
    rm bin/$TAR_NAME bin/README.md bin/LICENSE
    echo "Version:  $($HUGO_BIN version)"
fi

echo "================================"
echo "Cleaning"
echo "================================"
if [ -e $DIST_DIR ]; then
    rm -r $DIST_DIR && echo "Done."
else
    echo "Not Found '$DIST_DIR', Noting To Do!"
fi

echo "================================"
echo "Start Building"
echo "================================"
$HUGO_BIN --templateMetrics --minify -d $DIST_DIR
du -sh $DIST_DIR