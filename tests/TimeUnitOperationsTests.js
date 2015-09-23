var TimeUnit = require("../TimeUnit");
var assert = require("assert");

describe('Two TimeUnits', function() {
  it('can be added, which mutates one of them', function(done) {
    var hour = TimeUnit.hours(1);
	var quarter = TimeUnit.minutes(15);
	
	assert.equal(hour.add(quarter).toMinutes(), 75);
	assert.equal(hour.toMinutes(), 75);
	
	var second = TimeUnit.nanoseconds(1e9);
	assert.equal(second.add(quarter).toSeconds(), 901);
	assert.equal(second.toSeconds(), 901);
	
	done();
  });
  
  it('can be used to calculate time extended both, without mutating arguments', function(done) {
    var hour = TimeUnit.hours(1);
	var quarter = TimeUnit.nanoseconds(TimeUnit.minutes(15).toNanoseconds());
	
	assert.equal(hour.extended(quarter).toMinutes(), 75);
	assert.equal(hour.toMinutes(), 60);
	
	done();
  });
  
  it('can be used to set one another value', function(done) {
    var tenSeconds = TimeUnit.microseconds(TimeUnit.seconds(10).toMicroseconds());
	var week = TimeUnit.days(7);
	
	week.setTo(tenSeconds);
	assert.equal(week.toMilliseconds(), tenSeconds.toMilliseconds());
	
	done();
  });
  
  it('can be used to calculate time difference, mutatning one argument', function(done) {
    var tenSeconds = TimeUnit.seconds(10);
	var minute = TimeUnit.minutes(1);
	
	// behavior is a little weird - it's not meant for this use case
	var diff1 = minute.subtract(tenSeconds);
	var diff2 = tenSeconds.subtract(minute);
	
	assert.equal(diff1.toSeconds(), 50);
	assert.equal(minute.toSeconds(), 50);
	assert.equal(diff2.toSeconds(), -40);
	assert.equal(tenSeconds.toSeconds(), -40);
	
	done();
  });
  
  it('can be used to calculate time shortened, without mutating any argument', function(done) {
    var hour = TimeUnit.hours(1);
	var quarter = TimeUnit.seconds(TimeUnit.minutes(15).toSeconds());
	
	assert.equal(hour.shortened(quarter).toMinutes(), 45);
	assert.equal(hour.toMinutes(), 60);
	
	done();
  });

  it('can be used to calculate time shortened but may have floating-point errors in case of decimal places', function(done) {
    var hour = TimeUnit.hours(1);
	var quarter = TimeUnit.nanoseconds(TimeUnit.minutes(15).toNanoseconds());
	
	assert(Math.abs(hour.shortened(quarter).toMinutes() - 45) < 1e-12);
	assert.equal(hour.toMinutes(), 60);
	
	done();
  });
  
  it('can be compared in standard ways', function(done) {
    var hour = TimeUnit.hours(1);
	var threeQuarters = TimeUnit.minutes(45);
	
	assert(hour.isLongerThan(threeQuarters));
	assert(!hour.isShorterThan(threeQuarters));
	assert(!hour.isEqualTo(threeQuarters));
	assert(threeQuarters.isShorterThan(hour));
	assert(!threeQuarters.isLongerThan(hour));
	assert(!threeQuarters.isEqualTo(hour));
	
    done();
  });
  
  it('can be compared even if different units were used at first', function(done) {
    var month = TimeUnit.weeks(4);
	var monthInNanoseconds = TimeUnit.nanoseconds(1e9 * 60 * 60 * 24 * 7 * 4);
	
	assert(!month.isLongerThan(monthInNanoseconds));
	assert(!month.isShorterThan(monthInNanoseconds));
	assert(month.isEqualTo(monthInNanoseconds));
	
	assert(!monthInNanoseconds.isLongerThan(month));
	assert(!monthInNanoseconds.isShorterThan(month));
	assert(monthInNanoseconds.isEqualTo(month));
	
	done();	
  });
  
  it('can be reliably compared even after calculations', function(done) {
    var hour = TimeUnit.hours(1);
	var quarter = TimeUnit.minutes(15);
	var hourInQuarters = quarter.extended(quarter).extended(quarter).extended(quarter);
	assert(hour.isEqualTo(quarter.extended(quarter).extended(quarter).extended(quarter)));

	var second = TimeUnit.seconds(1);
	var quarterInSeconds = second.copy();
	
	var i;
	for(i = 0; i < 15 * 60; ++i) {
	  quarterInSeconds.add(second);
	};
	
	assert(quarterInSeconds.isLongerThan(quarter));
	quarterInSeconds.subtract(TimeUnit.nanoseconds(1e9 - 1));
	assert(quarterInSeconds.isLongerThan(quarter));
	quarterInSeconds.subtract(TimeUnit.nanoseconds(1));
	assert(quarterInSeconds.isEqualTo(quarter));
	quarterInSeconds.subtract(TimeUnit.nanoseconds(1));
	assert(quarterInSeconds.isShorterThan(quarter));
	
    done();
  });
  
  it('is still reliable after many calculations', function(done) {
    var month = TimeUnit.weeks(4);
	var day = TimeUnit.days(1);
	var minute = TimeUnit.minutes(1);
	var second = TimeUnit.seconds(1);
	var nanosecond = TimeUnit.nanoseconds(1);
	
	var toIncrease = nanosecond.copy();
	var toDecrease = month.copy();
	
	var i;
	for(i = 0; i < 27; ++i) {
	  toDecrease.subtract(day);
	}
	
	for(i = 0; i < 3600; ++i) {
	  toIncrease.add(second);
	}
	
	for(i = 0; i < 12*60; ++i) {
	  toDecrease.subtract(minute);
	}
	
	for(i = 0; i < 11*60; ++i) {
      toIncrease.add(minute);
	}
	
	assert(toIncrease.isLongerThan(toDecrease));
	assert(toDecrease.isShorterThan(toIncrease));
	toDecrease.add(nanosecond);
	assert(toIncrease.isEqualTo(toDecrease));
	assert(toDecrease.isEqualTo(toIncrease));
	toDecrease.add(nanosecond);
	assert(toIncrease.isShorterThan(toDecrease));
	assert(toDecrease.isLongerThan(toIncrease));
  
    done();
  });
});