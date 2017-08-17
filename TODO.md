# TODO

- Add option to download Riven as a PNG using `dom-to-image`. Something like a link to a blob:
```javascript
domtoimage.toPng(node)
  .then((dataUrl) => {
    let link = document.createElement('a');
    link.download = 'paris_visi-purado.png';
    link.href = dataUrl;
    link.click();
  });
```
- Add some more Weapon Names / Types... because why not...
- Add some form of persistance?
