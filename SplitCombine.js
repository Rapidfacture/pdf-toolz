const fs = require('mz/fs');
const WithTmpDir = require('with-tmp-dir-promise').WithTempDir;
const exec = require('mz/child_process').exec;
const path = require('path');
const _ = require('lodash');
const {requireExecutable} = require('./Utils');

requireExecutable('sh');
requireExecutable('pdftk');

/**
 * Split PDF into individual pges
 * @param {Buffer} The PDF to split (content, not filename)
 * @return Promise of array of individual page PDFs
 */
async function SplitPDF (pdfBuffer) {
    return WithTmpDir(async (tmpdir) => {
        const inpath = path.join(tmpdir, 'in.pdf');
        // Write input files
        await fs.writeFile(inpath, pdfBuffer);
        // Split. Burst into individual file
        const cmd = `sh -c 'cd ${tmpdir} && pdftk in.pdf burst'`;
        await exec(cmd);
        // Read all the files, pg_0001.pdf, pg_0002.pdf
        const files = await fs.readdir(tmpdir);
        const pages = files.filter(file => _.startsWith(file, 'pg_')).sort();
        const pagePaths = pages.map(page => path.join(tmpdir, page));
        const pagePromises = pagePaths.map(jpg => fs.readFile(jpg));
        return Promise.all(pagePromises);
    }, { unsafeCleanup: true, prefix: 'pdfoverlay-split-' });
}

/**
 * Combine multiple documents into one PDF file.
 * Usually this is used to combine multiple PDF files into one.
 * @param {Buffer[]} The PDF pages to combine.
 * @return Promise of combined PDF
 */
async function CombinePDF (pdfBuffer) {
    return WithTmpDir(async (tmpdir) => {
        const inpath = path.join(tmpdir, 'in.pdf');
        // Write input files
        await fs.writeFile(inpath, pdfBuffer);
        // Split. Burst into individual file
        const cmd = `sh -c 'cd ${tmpdir} && pdftk in.pdf burst'`;
        await exec(cmd);
        // Read all the files, e.g. pg_0001.pdf, pg_0002.pdf
        const files = await fs.readdir(tmpdir);
        const pages = files.filter(file => _.startsWith(file, 'pg_')).sort();
        const pagePaths = pages.map(page => path.join(tmpdir, page));
        const pagePromises = pagePaths.map(jpg => fs.readFile(jpg));
        return Promise.all(pagePromises);
    }, { unsafeCleanup: true, prefix: 'pdfoverlay-split-' });
}

async function test () {
    const pdf = await fs.readFile('multipage.pdf');
    const pages = await SplitPDF(pdf);
    await fs.writeFile('/ram/1.pdf', pages[0]);
    await fs.writeFile('/ram/2.pdf', pages[1]);
    await fs.writeFile('/ram/3.pdf', pages[2]);
}

// test()

module.exports = {
    SplitPDF: SplitPDF,
    CombinePDF: CombinePDF
};
