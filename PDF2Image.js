const fs = require('mz/fs');
const path = require('path');
const _ = require('lodash');
const WithTmpDir = require('with-tmp-dir-promise').WithTempDir;
const exec = require('mz/child_process').execFile;
const {requireNativeExecutableSync} = require('require-native-executable');
const { execFile } = require('child_process');

requireNativeExecutableSync('gm');

async function pdfToImage (pdfBuf, imgtype = 'jpg', dpi = 200) {
    return WithTmpDir(async (tmpdir) => {
        const srcpath = path.join(tmpdir, 'in.pdf');
        const outpath = path.join(tmpdir, `out-%04d.${imgtype}`);
        // Write input files
        await fs.writeFile(srcpath, pdfBuf);
        // Convert
        var cmd = `gm convert +adjoin -format ${imgtype} -density ${dpi} ${srcpath} -quality 95 ${outpath}`;
        cmd = cmd.split(' ');
        await execFile(cmd[0], cmd.slice(1));
        // Read all the files
        const files = await fs.readdir(tmpdir);
        const imgs = files.filter(file => _.endsWith(file, `.${imgtype}`)).sort();
        const imgPaths = imgs.map(img => path.join(tmpdir, img));
        const imgPromises = imgPaths.map(img => fs.readFile(img));
        return Promise.all(imgPromises);
    }, { unsafeCleanup: true, prefix: 'pdftoolz-pdf2img-' });
}

// test().then(console.log).catch(console.error);

module.exports = {
    pdfToImage: pdfToImage
};
