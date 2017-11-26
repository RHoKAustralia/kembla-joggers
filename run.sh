#!/bin/bash

set -ex

cd frontend
rm -rf node_modules
npm install
npm run build
cd ..
cp -r frontend/dist/* server/public

cd server
npm install
cd ..
node server
