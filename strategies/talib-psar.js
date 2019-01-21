var log = require('../core/log.js');

// Let's create our own method
var method = {};
// Prepare everything our method needs
method.init = function () {
    this.name = 'talib-psar';
    this.input = 'candle';
    this.trend = 'none';
    this.lastReals = [];
    this.requiredHistory = this.settings.historySize;
    this.addTalibIndicator('sar', 'sar', this.settings.parameters);
};

// What happens on every new candle?
method.update = function (candle) {
    //storing the results for trend calculation
    let entry = {
        real: this.talibIndicators.sar.result.outReal,
        candleClose: candle.close,
        upTrend: candle.close > this.talibIndicators.sar.result.outReal,
        isNewTrend: null
    };
    entry.isNewTrend = this.lastReals.length === 0 || this.lastReals[this.lastReals.length - 1].upTrend !== entry.trend;
    this.lastReals.push(entry);
    
    //removing old values to keep the memory usage low
    if(this.lastReals.length > this.settings.parameters.maxLastReals){
        this.lastReals.shift();
    }
    
    //if not new trend, wait some candles to go
    if(!entry.isNewTrend){
        this.advice();
    }else{
        log.debug(43, "talib-psar.js", entry.upTrend);
        this.advice(entry.upTrend ? 'short' : 'long');
    }
    log.debug(46, "talib-psar.js", entry.upTrend);
};

method.log = function () {
    // nothing!
};

method.check = function (candle) {

};

module.exports = method;
