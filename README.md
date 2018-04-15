# pdf-utils
NodeJS PDF utilities

## Installation

```sh
npm install mz pdf-utils
```

### Reading PDF page sizes

```js
const fs = require('mz/fs');
const {readPDFPageSizes} = require('pdf-utils/PageSizes');

async function readPageSizes() {
    const pdf = await fs.readFile('test/portrait-singlepage.pdf');
    const pageSizes = await pdfPageSizes(pdf);
    console.log(pageSizes); // [PageSize(842, 595)]);
}

readPageSizes()
```

### Converting PDF to one image per page

```js
const fs = require('mz/fs');
const {pdfToImage} = require('pdf-utils/PDF2Image');

async function exportPageImages() {
    const pdf = await fs.readFile('test/portrait-singlepage.pdf');
    const pageImages = await pdfToImage(pdf, 'png', 400 /* dpi */);
    // Export the page images
    await fs.writeFile("page-1.png", pageImages[0]);
    await fs.writeFile("page-2.png", pageImages[1]);
    await fs.writeFile("page-3.png", pageImages[2]);
}

exportPageImages()
```

### Splitting a PDF into pages (i.e. one PDF per page)

```js
const fs = require('mz/fs');
const {splitPDF} = require('pdf-utils/SplitCombine');

async function splitPDFIntoPages() {
    const pdf = await fs.readFile('test/portrait-multipage.pdf');
    const pages = await splitPDF(pdf);
    // Export the page images
    await fs.writeFile("page-1.pdf", pages[0]);
    await fs.writeFile("page-2.pdf", pages[1]);
    await fs.writeFile("page-3.pdf", pages[2]);
}

splitPDFIntoPages()
```

### Combining (appending) multiple PDFs into one

```js
const fs = require('mz/fs');
const {combinePDF} = require('pdf-utils/SplitCombine');

async function combinePDFs() {
    // Read two PDFs to be combined
    const pdf1 = await fs.readFile('test/portrait-singlepage.pdf');
    const pdf2 = await fs.readFile('test/landscape-singlepage.pdf');
    const combined = await combinePDF([pdf1, pdf2]);
    // Write output file
    await fs.writeFile('combined.pdf', combined);
}

combinePDFs()
```
