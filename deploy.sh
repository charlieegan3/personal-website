#!/bin/bash
git push origin develop
middleman build
middleman deploy
rm -rf build
