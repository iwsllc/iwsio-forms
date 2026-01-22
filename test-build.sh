#!/bin/sh
GITHUB_SHA=`git rev-parse HEAD`
docker build $@ -t forms:latest \
--secret id=npmrc,src=$HOME/.npmrc \
--build-arg GITHUB_SHA=$GITHUB_SHA \
$@ \
.
