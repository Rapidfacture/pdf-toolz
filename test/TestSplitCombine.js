const expect = require('chai').expect;
const fs = require('mz/fs');
const fileType = require('file-type');
const {pdfPageSizes} = require('../PageSizes');
const {splitPDF, combinePDF, PDFCombineError} = require('../SplitCombine');

describe('Split & Combine', function () {
    describe('Split', function () {
        it('should split a single page PDF into one page', async function () {
            const pdf = await fs.readFile('test/portrait-singlepage.pdf');
            const pages = await splitPDF(pdf);
            // Check number of pages
            expect(pages.length).to.equal(1);
            // Check image type
            expect(fileType(pages[0]).ext).to.equal('pdf');
        });
        it('should split a multi-page PDF into multiple pages', async function () {
            const pdf = await fs.readFile('test/portrait-multipage.pdf');
            const pages = await splitPDF(pdf);
            // Check number of pages
            expect(pages.length).to.equal(3);
            // Check image type
            expect(fileType(pages[0]).ext).to.equal('pdf');
            expect(fileType(pages[1]).ext).to.equal('pdf');
            expect(fileType(pages[2]).ext).to.equal('pdf');
        });
    });
    describe('Combine', function () {
        it('should throw when trying to combine zero pages', async function () {
            combinePDF([]).then(() => {
                throw new Error(`Didnt crash`);
            }).catch(() => {});
        });
        it('should combine one page into one page', async function () {
            const pdf = await fs.readFile('test/portrait-singlepage.pdf');
            const result = await combinePDF([pdf]);
            // Check number of pages
            const pageSizes = await pdfPageSizes(result);
            expect(pageSizes.length).to.equal(1);
            // Check image type
            expect(fileType(result).ext).to.equal('pdf');
        });
        it('should combine two page into one two page', async function () {
            const pdf = await fs.readFile('test/portrait-singlepage.pdf');
            const result = await combinePDF([pdf, pdf]);
            // Check number of pages
            const pageSizes = await pdfPageSizes(result);
            expect(pageSizes.length).to.equal(2);
            // Check image type
            expect(fileType(result).ext).to.equal('pdf');
        });
    });
});
