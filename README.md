wdio-mocha-bamboo-reporter
==========================

A WDIO reporter for bamboo integration, derived from [wdio-mochawesome-reporter](https://github.com/fijijavis/wdio-mochawesome-reporter).

Installation
------------

`yarn add wdio-mocha-bamboo-reporter`


Usage
-----

Edit your `wdio.conf.js` file like so:

```
module.exports = {
  // ...
  reporters: ['dot', 'mocha-bamboo'],
  // ...
};
```
