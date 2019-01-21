// Let's create our own method
var method = {};
// Prepare everything our method needs
method.init = function() {
  this.name = 'tulip-bb';
  this.trend = 'none';
  this.indicatorResults = [];
  this.requiredHistory = this.settings.historySize;
  this.addTulipIndicator('mytulip-bb', 'tulip-bb', this.settings.parameters);
  console.log(10, 'tulip-bb.js', this.settings);
}
// What happens on every new candle?
method.update = function(candle) {
  // nothing!
}
method.log = function() {
  // nothing!
}
method.check = function(candle) {
  console.log(19, 'tulip-bb.js', this);
  var price = candle.close;
  var bbands = this.tulipIndicators.bbands.result.result;
  console.log(23, 'tulip-bb.js', this.tulipIndicators.bbands, candle);
  /*
    requires: ['optInTimePeriod', 'optInNbStdDevs'],
        create: (params) => {
        verifyParams('bbands', params);
        
        return (data, callback) => execute(callback, {
            indicator: tulind.indicators.bbands,
            inputs: [data.close],
            options: [params.optInTimePeriod, params.optInNbStdDevs],
            results: ['bbandsLower', 'bbandsMiddle', 'bbandsUpper'],
        });*/

  if(this.settings.thresholds.down > bbands && this.trend !== 'short') {
    this.trend = 'short';
    this.advice('short');
  } else if(this.settings.thresholds.up < bbands && this.trend !== 'long'){
    this.trend = 'long';
    this.advice('long');
  }
}

module.exports = method;
