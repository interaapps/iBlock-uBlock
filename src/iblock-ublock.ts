import {IBlockOptions} from './iblockoptions';
import {DetectFunctions} from "./detectfunctions";

export default class IBlockUBlock {
  // @ts-ignore because it's assigned in applyOptions
  private options: IBlockOptions;

  private baitClassArray: Array<string> = [
    'pub_300x250',
    'pub_300x250m',
    'pub_728x90',
    'textAd',
    'text-ad',
    'text_ad',
    'testAds',
    'text-ads',
    'text_ads',
    'text-ad-links'
  ];

  private baitStyleArray: Array<string> = [
    'width: 1px !important;',
    'height: 1px !important;',
    'position: absolute !important;',
    'left: -10000px !important;',
    'top: -1000px !important;'
  ];

  // @ts-ignore because it's assigned in setDefaultBaitOptions
  private baitOptions: {
    bait?: Element | null,
    offsetParent?: Element | null,
    offsetHeight?: number,
    offsetWidth?: number,
    offsetLeft?: number,
    offsetTop?: number,
    clientWidth?: number,
    clientHeight?: number
  };

  private checkRunning = false;
  private loopNumber: number = 0;

  // @ts-ignore because it's always set when in use
  private looper: NodeJS.Timeout;

  // @ts-ignore because it's assigned in applyDetectFunctions
  private detectFunctions: DetectFunctions;
  private detected: boolean = false;

  constructor(detectFunctions?: DetectFunctions, opts?: IBlockOptions) {
    this.applyOptions(opts);
    this.applyDetectFunctions(detectFunctions);
    this.setDefaultBaitOptions();
  }

  public applyDetectFunctions(detectFunctions?: DetectFunctions) {
    this.detectFunctions = {
      onDetected(): void { console.log('AdBlock Detected'); },
      onNotDetected(): void { console.log('No AdBlock Detected'); }
    }
    Object.assign(this.detectFunctions, detectFunctions);
  }

  public applyOptions(opts?: IBlockOptions) {
    this.options = {
      baitClass: this.stringArrayToString(this.baitClassArray),
      baitStyle: this.stringArrayToString(this.baitStyleArray),
      loopCheckTime: 50,
      loopMaxNumber: 5,
      loop: true
    };

    Object.assign(this.options, opts);
  }

  public run(): void {
    if(this.baitOptions.bait === undefined ||
      this.baitOptions.bait === null) {
      this.createBait();
    }

    setTimeout(() => this.check(), 1);
  }

  private stringArrayToString(array: Array<string>, delimiter: string = ' '): string {
    let combined: string = ''
    for (let pos = 0; pos < array.length; pos++) {
      combined += (pos === 0 ? '' : delimiter + array[pos])
    }
    return combined
  }

  private setDefaultBaitOptions(): void {
    this.baitOptions = {
      bait: null,
      offsetParent: null,
      offsetHeight: 0,
      offsetWidth: 0,
      offsetLeft: 0,
      offsetTop: 0,
      clientWidth: 0,
      clientHeight: 0
    };
  }

  private createBait(): void {
    const bait: HTMLDivElement = document.createElement('div');
    if(this.options.baitClass !== undefined) {
      bait.setAttribute('class', this.options.baitClass)
    }
    if(this.options.baitStyle !== undefined) {
      bait.setAttribute('style', this.options.baitStyle)
    }
    window.document.body.appendChild(bait);

    Object.assign(this.baitOptions, {
      bait: bait,
      offsetParent: bait.offsetParent,
      offsetHeight: bait.offsetHeight,
      offsetWidth: bait.offsetWidth,
      offsetLeft: bait.offsetLeft,
      offsetTop: bait.offsetTop,
      clientWidth: bait.clientWidth,
      clientHeight: bait.clientHeight
    });
  }

  private destroyBait(): void {
    if(this.baitOptions.bait != null) {
      window.document.body.removeChild(this.baitOptions.bait);
    }
    this.setDefaultBaitOptions();
  }

  private check(): void {
    if (this.checkRunning) return;
    this.checkRunning = true;

    if(this.baitOptions.bait === null) {
      this.createBait();
    }

    let self = this;
    if(this.options.loop) {
      if(this.options.loopMaxNumber === undefined) {
        this.options.loopMaxNumber = 50
      }

      this.looper = setInterval(function () {
        self.checkBait();
      }, this.options.loopMaxNumber);
    }
    setTimeout(function() {
      self.checkBait();
    }, 1);
  }

  private checkBait(): void {
    if(this.baitOptions.bait === null) {
      this.createBait();
    }

    if(window.document.body.getAttribute('abp') !== null
      || this.baitOptions.offsetParent === null
      || this.baitOptions.offsetHeight === 0
      || this.baitOptions.offsetLeft === 0
      || this.baitOptions.offsetTop === 0
      || this.baitOptions.offsetWidth === 0
      || this.baitOptions.clientHeight === 0
      || this.baitOptions.clientWidth === 0) {
      this.detected = true;
    }

    if (this.baitOptions.bait != null) {
      const baitTemp = window.getComputedStyle(this.baitOptions.bait, null)
      if (baitTemp && (baitTemp.getPropertyValue('display') === 'none'
        || baitTemp.getPropertyValue('visibility') === 'hidden')) {
        this.detected = true
      }
    } else {
      this.detected = true
    }


    if (this.options.loop) {
      this.loopNumber++;

      if(this.options.loopMaxNumber === undefined) {
        this.options.loopMaxNumber = 50
      }

      if (this.loopNumber >= this.options.loopMaxNumber) {
        this.stopLoop();
      }
    }

    if(this.detected) {
      this.stopLoop();
      this.destroyBait();
      this.detectFunctions.onDetected();
      if(this.options.loop) {
        this.checkRunning = false;
      }
    } else {
      this.destroyBait();
      if(this.options.loop) {

        if(this.options.loopMaxNumber === undefined) {
          this.options.loopMaxNumber = 50
        }

        if((this.loopNumber +1) >= this.options.loopMaxNumber) {
          this.detectFunctions.onNotDetected();
        }
        this.checkRunning = false;
      }
    }
  }

  private stopLoop(): void {
    clearInterval(this.looper);
    this.loopNumber = 0;
  }
}
