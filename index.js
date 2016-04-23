const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-promise');
const exec = require('child_process').exec;

const prependingSoundFile = path.join(__dirname, 'error.mp3');
const originalsPath = path.join(__dirname, 'org');
const outputPath = path.join(__dirname, 'combined');


const ffmpegPromiser = function(filename) {
    const concatting = prependingSoundFile + '|' + path.join(originalsPath, filename);
    const output = path.join(outputPath, 'c_' + filename).replace(/\..+$/, '.mp3');
    return new Promise(resolve => {
        exec(`ffmpeg -i concat:"${concatting}" -qscale:a 1 -codec copy ${output}`, err => {
            const rv = err ? filename : '';
            resolve('');
        }); 
    });
} 

rimraf(outputPath)
    .then(() => mkdirp(outputPath))
    .then(() => fs.readdirSync(originalsPath).filter(filename => filename[0] != '.'))
    .then(files => Promise.all(files.map(ffmpegPromiser)))
    .then(() => { console.log('Everything is OK') });
