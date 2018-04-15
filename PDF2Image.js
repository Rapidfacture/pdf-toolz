const fs = require('mz/fs');
const path = require('path');
const _ = require('lodash');
const WithTmpDir = require('with-tmp-dir-promise').WithTempDir;
const exec = require('mz/child_process').exec;
const {requireExecutable} = require('./Utils');

requireExecutable('convert');

async function convertPDFToJPG (pdfBuf, imgtype = 'jpg', dpi = 200) {
    return WithTmpDir(async (tmpdir) => {
        const srcpath = path.join(tmpdir, 'in.pdf');
        const outpath = path.join(tmpdir, `out-%04d.${imgtype}`);
        // Write input files
        await fs.writeFile(srcpath, pdfBuf);
        // Convert
        const cmd = `convert -format ${imgtype} -density ${dpi} ${srcpath} -quality 95 ${outpath}`;
        await exec(cmd);
        // Read all the files
        const files = await fs.readdir(tmpdir);
        const imgs = files.filter(file => _.endsWith(file, `.${imgtype}`)).sort();
        const imgPaths = imgs.map(img => path.join(tmpdir, img));
        const imgPromises = imgPaths.map(img => fs.readFile(img));
        return Promise.all(imgPromises);
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
