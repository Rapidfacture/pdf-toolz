const fs = require('mz/fs');
const path = require('path');
const _ = require('lodash');
const WithTmpDir = require('with-tmp-dir-promise').WithTempDir;
const exec = require('mz/child_process').exec;
const {requireExecutable} = require('./Utils');

requireExecutable('convert');

async function convertPDFToJPG (pdfBuf, imgtype = 'jpg') {
    return WithTmpDir(async (tmpdir) => {
        const srcpath = path.join(tmpdir, 'in.pdf');
        const outpath = path.join(tmpdir, 'out-%04d.jpg');
        // Write input files
        await fs.writeFile(srcpath, pdfBuf);
        // Convert
        const cmd = `convert -format jpg -density 200 ${srcpath} -quality 95 ${outpath}`;
        await exec(cmd);
        // Read all the files
        const files = await fs.readdir(tmpdir);
        const jpgs = files.filter(file => _.endsWith(file, '.jpg')).sort();
        const jpgPaths = jpgs.map(jpg => path.join(tmpdir, jpg));
        const jpgPromises = jpgPaths.map(jpg => fs.readFile(jpg));
        return Promise.all(jpgPromises);
    }, { unsafeCleanup: true, prefix: 'pdfoverlay-pdf2jpg-' });
}

async function test () {
    const pdfData = await fs.readFile('multipage.pdf');
    const jpgs = await convert(pdfData);
    await fs.writeFile('out.jpg', jpgs[0]);
}

// test().then(console.log).catch(console.error);

module.exports = {
    convertPDFToJPG: convertPDFToJPG
};
