const fs = require('mz/fs');
const path = require('path');
const _ = require('lodash');
const withTmpDir = require('with-tmp-dir-promise').WithTempDir;
// const exec = require('mz/child_process').execFile;
const {requireNativeExecutableSync} = require('require-native-executable');
const { execFile } = require('child_process');

requireNativeExecutableSync('gm');

async function pdfToImage (pdfBuf, imgtype = 'jpg', dpi = 200) {
    return withTmpDir(async (tmpdir) => {
        const srcpath = path.join(tmpdir, 'in.pdf');
        const outpath = path.join(tmpdir, `out-%04d.${imgtype}`);
        // Write input files
        await fs.writeFile(srcpath, pdfBuf);
        // Convert
        var cmd = `gm convert +adjoin -format ${imgtype} -density ${dpi} ${srcpath} -quality 95 ${outpath}`;
        cmd = cmd.split(' ');
        // execute the command reliable async using a promise
        await new Promise((resolve, reject) => {
            execFile(cmd[0], cmd.slice(1), execThenFunct(resolve, reject));
        });
        // Read all the files
        const files = await fs.readdir(tmpdir);
        // console.log('files', files);
        const imgs = files.filter(file => _.endsWith(file, `.${imgtype}`)).sort();
        const imgPaths = imgs.map(img => path.join(tmpdir, img));
        const imgPromises = imgPaths.map(img => fs.readFile(img));
        return Promise.all(imgPromises);
    }, { unsafeCleanup: true, prefix: 'pdftoolz-pdf2img-' });
}


async function imageToPdf (buffer, opts) {
    return withTmpDir(async (tmpdir) => {
        const srcpath = path.join(tmpdir, 'imageToPdfInPutImage');
        const outpath = path.join(tmpdir, `out-%04d.pdf`);
        // Write input files
        await fs.writeFile(srcpath, buffer);
        // Convert
        var cmd = `gm convert ${srcpath} ${outpath}`;
        cmd = cmd.split(' ');
        // execute the command reliable async using a promise
        await new Promise((resolve, reject) => {
            execFile(cmd[0], cmd.slice(1), {timeout: 2000}, execThenFunct(resolve, reject));
        });
        // Read all the files
        return fs.readFile(outpath);
    }, { unsafeCleanup: true, prefix: 'pdftoolz-pdf2img-' });
}


/** execThenFunct
 * help to wrapp a promise around execFile
 * otherwise execFile returns only the childprocess, before it has finished
 */
function execThenFunct (resolve, reject) {
    return function (err, data) {
        let returnValue;
        if (err) {
            returnValue = 'ERROR:\n' + err;
            reject(returnValue);
        } else {
            returnValue = data.toString();
            resolve(returnValue);
        }
        console.log('cmd return value: ' + returnValue);
    };
}


module.exports = {
    imageToPdf,
    pdfToImage
};
