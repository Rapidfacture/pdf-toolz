# pdf-utils
NodeJS PDF utilities

### Reading PDF page sizes

```js
const {readPDFPageSizes} = require('pdf-utils/PageSizes');

async function readPageSizes() {
    const pdf = await fs.readFile('test/portrait-singlepage.pdf');
    const pageSizes = await readPDFPageSizes(pdf);
    console.log(pageSizes); // [new PageSize(842, 595)]);
}

readPageSizes()
```

### Converting PDF to one image per page

```js
const {pdfToImage} = require('pdf-utils/PDF2Image');

async function exportPageImages() {
    const pdf = await fs.readFile('test/portrait-singlepage.pdf');
    const pageImages = await pdfToImage(pdf, 'png', 400 /* dpi */);
    //
    await fs.writeFile("page-1.png", pageImages[0]);
    await fs.writeFile("page-2.png", pageImages[1]);
    await fs.writeFile("page-3.png", pageImages[2]);
    console.log(pageSizes); // [new PageSize(842, 595)]);
}

exportPageImages()
```