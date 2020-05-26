#!/usr/bin/env node

'use strict';

const { promisify } = require('util');
const path = require('path');

const { copy } = require('fs-extra');
const zipFolder = require('zip-folder');

const { version: VERSION } = require('../manifest.json');

const zip = promisify(zipFolder);

const EXTENSION_DIR = path.resolve(__dirname, '..');
const EXTENSION_DIST_DIR = path.resolve(EXTENSION_DIR, 'dist');

const EXTENSION_BUILD_ZIP = path.resolve(EXTENSION_DIR, `poc-${VERSION}.zip`);

const EXTENSION_RESOURCES = ['assets', 'panels', 'settings', 'scripts', 'manifest.json'];

async function build() {
    try {
        console.log('======= Cleanup Dist, Build, & Zip ======');
        console.log('======= Move/Copy Resources to dist Dir ======');
        await Promise.all(EXTENSION_RESOURCES.map(resource => copy(
            path.resolve(EXTENSION_DIR, resource),
            path.resolve(EXTENSION_DIST_DIR, resource)
        )));
        await zip(EXTENSION_DIST_DIR, EXTENSION_BUILD_ZIP);
        console.log('new extension zip created:', EXTENSION_BUILD_ZIP);
    } catch (error) {
        console.error('build failed', error);
    }
}

build().catch(console.error);