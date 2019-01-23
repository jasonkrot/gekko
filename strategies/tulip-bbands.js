var log = require('../core/log');

// Let's create our own method
var method = {};
// Prepare everything our method needs
method.init = function () {
    this.name = 'tulip-bbands';
    this.trend = 'none';
    this.requiredHistory = this.settings.historySize;
    this.addTulipIndicator('bollingerBands', 'bbands', this.settings.parameters);
}
// What happens on every new candle?
method.update = function (candle) {
    // nothing!
}
method.log = function () {
    // nothing!
}
method.check = function (candle) {
    //console.log(21, 'tulip-bbands.js', this);
    var price = candle.close;
    var bbands = this.tulipIndicators.bollingerBands.result;
    //console.log(this.tulipIndicators.bollingerBands.result, candle.close);
    this.indicatorResults(bbands);
    if (candle.close < bbands.bbandsLower && this.trend !== 'long') {
        this.trend = 'long';
        this.advice('long');
    } else if (candle.close < bbands.bbandsUpper && this.trend !== 'short') {
        this.trend = 'short';
        this.advice('short');
    }
}

module.exports = method;