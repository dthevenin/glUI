#!/bin/sh

rm -rf temp
mkdir temp
cp -R gui temp

export TEST_PATH=`pwd`

open -a Safari http://localhost:8000/tests/temp/gui/index.html