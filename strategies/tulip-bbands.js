var log = require('../core/log');

// Let's create our own method
var method = {};
// Prepare everything our method needs
method.init = function () {
    this.name = 'tulip-bbands';
    this.trend = 'none';
    this.requiredHistory = this.settings.historySize;
    this.addTulipIndicator('bollingerBands', 'bbands', this.settings.parameters);
    /*
    { // ignored when direction is not "long"type: 'stopTrailingLoss',
        stopLossPercent : this.settings.thresholds.stopLossPercent,
        trailPercentage : this.settings.thresholds.trailPercentage,
        goalPercent : this.settings.thresholds.goalPercent
    }*/
    this.goalValue = null;
    this.stopLossValue = null;
    this.trailingValue = null;
    this.trailingActive = false;
    this.lastLow = null;
    this.lastHigh = null;
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
    this.indicatorResults({
        color: 'black',
        lines: Object.keys(bbands).map(prop => bbands[prop])
    });
    if (this.goalValue !== null && this.goalValue <= candle.close || this.stopLossValue !== null && this.stopLossValue >= candle.close) {
        this.trend = 'none';
        this.advice('short');
        this.goalValue = null;
        this.stopLossValue = null;
    } else {
        if (candle.low < bbands.bbandsLower && this.trend !== 'up') {
            this.trend = 'up';
            this.buyOnReverse = true;
        } else if (candle.high > bbands.bbandsUpper && this.trend !== 'down') {
            this.trend = 'down';
            this.advice('short');
            this.buyOnReverse = true;
        }
        if (this.buyOnReverse) {
            if (this.trend === 'up') {
                if (this.lastLow <= candle.low) {
                    this.stopLossValue = candle.close - candle.close * (this.settings.thresholds.stopLossPercent / 100);
                    this.goalValue = candle.close - candle.close * (this.settings.thresholds.goalPercent / 100);
                    this.advice('long');
                }
            } else if (this.trend === 'down') {
                if (this.lastHigh >= candle.high) {
                    this.advice('short');
                }
            }
        }
    }
    this.lastLow = candle.low;
    this.lastHigh = candle.high;
}

module.exports = method;