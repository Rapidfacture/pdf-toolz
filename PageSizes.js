const pdfjs = require('pdfjs-dist');
const bereich = require('bereich');

class PageSize {
    constructor (width, height) {
        this.width = width;
        this.height = height;
    }
}

function getPageSize (page) {
    const [x, y, w, h] = page.pageInfo.view;
    return new PageSize(w - x, h - y);
}

/**
 * Adapted from
 * https://techoverflow.net/2018/04/13/extract-pdf-page-sizes-using-pdfjs-nodejs/
 * @param {Buffer} buffer A buffer of the PDF
 * @return Promise of array of PageSize objects
 */
async function readPDFPageSizes (buffer) {
    const pdf = await pdfjs.getDocument({data: buffer});
    const numPages = pdf.numPages;

    const pageNumbers = Array.from(bereich(1, numPages));
    // Start reading all pages 1...numPages
    const promises = pageNumbers.map(pageNo => pdf.getPage(pageNo));
    // Wait until all pages have been read
    const pages = await Promise.all(promises);
    // You can do something with pages here.
    return pages.map(getPageSize);
}

function convertPtToInch (pt) { return pt / 72; }
function convertInchToMM (inch) { return inch * 25.4; }
function convertPtToMM (pt) {
    return convertInchToMM(convertPtToInch(pt));
}

module.exports = {
    readPDFPageSizes: readPDFPageSizes,
    PageSize: PageSize,
    convertPtToInch: convertPtToInch,
    convertInchToMM: convertInchToMM,
    convertPtToMM: convertPtToMM
};
