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