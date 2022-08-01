var SpeedTest = function(testImplement,testParams,repetitions) {
  this.testImplement = testImplement;
  this.testParams = testParams;
  this.repetitions = repetitions || 10000;
  this.average = 0;
};

SpeedTest.prototype = {
  startTest: function() {
    if (this.testImplement(this.testParams) === false) {
      alert('Test failed with those parameters.');
      return;
    }
    var beginTime, endTime, sumTimes = 0;
    for (var i = 0, x = this.repetitions; i < x; i++) {
      beginTime = +new Date();
      this.testImplement(this.testParams);
      endTime = +new Date();
      sumTimes += endTime - beginTime;
    }
    this.average = sumTimes / this.repetitions;
    return console.log('Average execution across ' + this.repetitions + ': ' + this.average);
  }
};

var IP = ['Nipping Global Variable', 'Sneaky Forin', 'Bulging Blocking Script'],
GH = ['Switch Blocks', 'Pesky Gnat', 'Aiedra'],
inhabitants = [IP,GH];

function populationGetterConcat(popn) {
  var list = '';
  for (var i = 0, x = popn.length; i < x; i++) {
    for (var j = 0; j < popn[i].length; j++) {
      list += (popn[i][j] + ', ');
    }
  }
  return list;
}

populationGetterConcat(inhabitants);

function populationGetterJoin(popn) {
  var list = [];
  for (var i = 0, x = popn.length; i < x; i++) {
    list.push(popn[i].join(', '));
  }
  return list.join(', ');
}

populationGetterJoin(inhabitants);

var concatTest = new SpeedTest(populationGetterConcat, inhabitants, 100000);
concatTest.startTest();
var joinTest = new SpeedTest(populationGetterJoin, inhabitants);
joinTest.startTest();
