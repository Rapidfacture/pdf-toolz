const fs = require('mz/fs');
const WithTmpDir = require('with-tmp-dir-promise').WithTempDir;
const exec = require('mz/child_process').exec;
const path = require('path');
const _ = require('lodash');
const {requireNativeExecutableSync} = require('require-native-executable');

requireNativeExecutableSync('gs');

/**
 * Split PDF into individual pges
 * @param {Buffer} The PDF to split (content, not filename)
 * @return Promise of array of individual page PDFs
 */
async function splitPDF (pdfBuffer) {
    return WithTmpDir(async (tmpdir) => {
        const inpath = path.join(tmpdir, 'in.pdf');
        // Write input files
        await fs.writeFile(inpath, pdfBuffer);
        // Split. Burst into individual file
        const cmd = `gs -sDEVICE=pdfwrite -dSAFER -dPDFSETTINGS=/prepress -o page.%08d.pdf in.pdf`;
        await exec(cmd, {cwd: tmpdir});
        // Read all the files, pg_0001.pdf, pg_0002.pdf
        const files = await fs.readdir(tmpdir);
        const pages = files.filter(file => _.startsWith(file, 'page.')).sort();
        const pagePaths = pages.map(page => path.join(tmpdir, page));
        const pagePromises = pagePaths.map(jpg => fs.readFile(jpg));
        return Promise.all(pagePromises);
    }, { unsafeCleanup: true, prefix: 'pdfoverlay-split-' });
}

/**
 * Combine multiple documents into one PDF file.
 * Usually this is used to combine multiple PDF files into one.
 * @param {Buffer[]} The PDFs to combine.
 * @return Promise of combined PDF
 */
async function combinePDF (pdfBuffers) {
    return WithTmpDir(async (tmpdir) => {
        const outpath = path.join(tmpdir, `out.pdf`);
        // Write input files & assemble command.
        let cmd = `gs -sDEVICE=pdfwrite -dSAFER -dPDFSETTINGS=/prepress -o ${outpath}`;
        const promises = [];
        for (let i = 0; i < pdfBuffers.length; i++) {
            const pdfPath = path.join(tmpdir, `in-${i}.pdf`);
            promises.push(fs.writeFile(pdfPath, pdfBuffers[i]));
            cmd += ` ${pdfPath}`;
        }
        await Promise.all(promises);
        await exec(cmd);
        // Read the result file
        return fs.readFile(outpath);
    }, { unsafeCleanup: true, prefix: 'pdfoverlay-combine-' });
}

module.exports = {
    splitPDF: splitPDF,
    combinePDF: combinePDF
};
