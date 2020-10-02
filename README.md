# iBlock-uBlock

[![Stars](https://img.shields.io/github/stars/interaapps/iBlock-uBlock.svg)](https://github.com/interaapps/iBlock-uBlock)

[![Forks](https://img.shields.io/github/forks/interaapps/iBlock-uBlock.svg)](https://github.com/interaapps/iBlock-uBlock)

iBlock-uBlock is an open source AdBlockDetector written in typescript
* easy to use
* declare methods on detection and run

## Installation
##### NPM
```bash
npm i iBlock-uBlock
```
##### Yarn
```bash
yarn add iBlock-uBlock
```

## Usage
```typescript
const iBlockUBlock = new IBlockUBlock({
  onDetected(): void {
    // adblocker detected
  },
  onNotDetected(): void {
    // no adblocker detected
  }
});

iBlockUBlock.run();
```

## Maintainers
This project is mantained by:
| Avatar | Contributor |
|---|:---:|
| [![](https://avatars3.githubusercontent.com/u/46448715?s=50&v=4)](http://github.com/DatL4g) | [DatLag](http://github.com/DatL4g) |

## Contributing

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -m 'Add some feature')
5. Push your branch (git push origin my-new-feature)
6. Create a new Pull Request

## License

View full license [here](LICENSE). In short:

> Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license.
>Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.
