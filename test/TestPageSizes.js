const expect = require('chai').expect;
const fs = require('mz/fs');
const {pdfPageSizes, PageSize, convertInchToMM, convertPtToMM, convertPtToInch} = require('../PageSizes');

describe('PageSize', function () {
    describe('pdfPageSizes', function () {
        it('should read correct page sizes for portrait single page', async function () {
            const pdf = await fs.readFile('test/portrait-singlepage.pdf');
            // With rotation
            const pageSizes = await pdfPageSizes(pdf);
            expect(pageSizes).to.deep.equal([new PageSize(595, 842)]);
            // Without rotation
            const pageSizes2 = await pdfPageSizes(pdf, {ignoreRotation: true});
            expect(pageSizes2).to.deep.equal([new PageSize(595, 842)]);
        });
        it('should read correct page sizes for landscape single page', async function () {
            const pdf = await fs.readFile('test/landscape-singlepage.pdf');
            // With rotation
            const pageSizes = await pdfPageSizes(pdf);
            expect(pageSizes).to.deep.equal([new PageSize(842, 595)]);
            // Without rotation
            const pageSizes2 = await pdfPageSizes(pdf, {ignoreRotation: true});
            expect(pageSizes2).to.deep.equal([new PageSize(595, 842)]);
        });
        it('should read correct page sizes for portrait multi page', async function () {
            const pdf = await fs.readFile('test/portrait-multipage.pdf');
            // With rotation
            const pageSizes = await pdfPageSizes(pdf);
            expect(pageSizes).to.deep.equal([
                new PageSize(595, 842),
                new PageSize(595, 842),
                new PageSize(595, 842)
            ]);
            // Without rotation
            const pageSizes2 = await pdfPageSizes(pdf, {ignoreRotation: true});
            expect(pageSizes2).to.deep.equal([
                new PageSize(595, 842),
                new PageSize(595, 842),
                new PageSize(595, 842)
            ]);
        });
        it('should read correct page sizes for landscape multi page', async function () {
            const pdf = await fs.readFile('test/landscape-multipage.pdf');
            // With rotation
            const pageSizes = await pdfPageSizes(pdf);
            expect(pageSizes).to.deep.equal([
                new PageSize(842, 595),
                new PageSize(842, 595),
                new PageSize(842, 595)
            ]);
            // Without rotation
            const pageSizes2 = await pdfPageSizes(pdf, {ignoreRotation: true});
            expect(pageSizes2).to.deep.equal([
                new PageSize(595, 842),
                new PageSize(595, 842),
                new PageSize(595, 842)
            ]);
        });
    });
    describe('convertPtToInch', function () {
        it('should convert pt to inch', async function () {
            expect(convertPtToInch(595)).to.be.closeTo(8.26389, 0.01);
            expect(convertPtToInch(842)).to.be.closeTo(11.6944, 0.01);
        });
    });
    describe('convertPtToMM', function () {
        it('should convert pt to mm', async function () {
            expect(convertPtToMM(595)).to.be.closeTo(210, 0.1);
            expect(convertPtToMM(842)).to.be.closeTo(297, 0.1);
        });
    });
    describe('convertInchToMM', function () {
        it('should convert inch to mm', async function () {
            expect(convertInchToMM(1)).to.be.closeTo(25.4, 0.001);
            expect(convertInchToMM(10)).to.be.closeTo(254.0, 0.001);
        });
    });
});
