const expect = require('chai').expect;
const fs = require('mz/fs');
const {pdfToImage} = require('../PDF2Image');
const fileType = require("file-type")

describe('PDF2Image', function () {
    describe('pdfToImage', function () {
        it('should produce a JPG for a single page PDF', async function () {
            const pdf = await fs.readFile('test/portrait-singlepage.pdf');
            const pageImages = await pdfToImage(pdf, 'jpg', 50);
            // Check number of pages
            expect(pageImages.length).to.equal(1);
            // Check image type
            const img = pageImages[0];
            expect(fileType(img).ext).to.equal('jpg');
        });
        it('should produce a PNG for a single page PDF', async function () {
            const pdf = await fs.readFile('test/portrait-singlepage.pdf');
            const pageImages = await pdfToImage(pdf, 'png', 50);
            // Check number of pages
            expect(pageImages.length).to.equal(1);
            // Check image type
            const img = pageImages[0];
            expect(fileType(img).ext).to.equal('png');
        });
        it('a larger DPI value should produce larger files', async function () {
            const pdf = await fs.readFile('test/portrait-singlepage.pdf');
            const pageImages30 = await pdfToImage(pdf, 'png', 30);
            const pageImages100 = await pdfToImage(pdf, 'png', 100);
            // Check number of pages
            expect(pageImages30.length).to.equal(1);
            expect(pageImages100.length).to.equal(1);
            // Check image type
            const img30 = pageImages30[0];
            const img100 = pageImages100[0];
            expect(img100.length).to.be.greaterThan(img30.length);
        });
        it('should produce multiple images for a multi-page PDF', async function () {
            const pdf = await fs.readFile('test/portrait-multipage.pdf');
            const pageImages = await pdfToImage(pdf, 'png', 50);
            // Check number of pages
            expect(pageImages.length).to.equal(3);
        });
    });
});
