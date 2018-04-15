const pdfjs = require('pdfjs-dist');
const bereich = require('bereich');

class PageSize {
    constructor (width, height) {
        this.width = width;
        this.height = height;
    }
}

function getPageSize (page, ignoreRotation = false) {
    const [x, y, w, h] = page.pageInfo.view;
    const width = w - x;
    const height = h - y;
    const rotate = page.pageInfo.rotate;
    // Consider rotation
    return !ignoreRotation && (rotate === 90 || rotate === 270)
        ? new PageSize(height, width) : new PageSize(width, height);
}

/**
 * Adapted from
 * https://techoverflow.net/2018/04/13/extract-pdf-page-sizes-using-pdfjs-nodejs/
 * @param {Buffer} buffer A buffer of the PDF
 * @param opts ignoreRotation If true, ignore the rotation when computing the page size
 * @return Promise of array of PageSize objects
 */
async function pdfPageSizes (buffer, opts = {}) {
    const ignoreRotation = opts.ignoreRotation || false;

    const pdf = await pdfjs.getDocument({data: buffer});
    const numPages = pdf.numPages;

    const pageNumbers = Array.from(bereich(1, numPages));
    // Start reading all pages 1...numPages
    const promises = pageNumbers.map(pageNo => pdf.getPage(pageNo));
    // Wait until all pages have been read
    const pages = await Promise.all(promises);
    // You can do something with pages here.
    return pages.map(page => getPageSize(page, ignoreRotation));
}

function convertPtToInch (pt) { return pt / 72; }
function convertInchToMM (inch) { return inch * 25.4; }
function convertPtToMM (pt) {
    return convertInchToMM(convertPtToInch(pt));
}

module.exports = {
    pdfPageSizes: pdfPageSizes,
    PageSize: PageSize,
    convertPtToInch: convertPtToInch,
    convertInchToMM: convertInchToMM,
    convertPtToMM: convertPtToMM
};
