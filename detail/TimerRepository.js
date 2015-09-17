var assert = require("assert");

function TimerRepository() {
  this.uid = 1;
  this.timers = [];  
}

TimerRepository.prototype.insertTimer = function(timer) {

  // to make uid instrigifiable, like the original one
  timer.uid = {uid: this.uid++};
  timer.uid.ref = timer.uid;
  
  var i;
  for(i = 0; i < this.timers.length; ++i) {
    if(this.timers[i].dueTime > timer.dueTime) {
	  break;
	}
  }
  
  this.timers.splice(i, 0, timer);
  return timer.uid;
};

TimerRepository.prototype.removeTimer = function(timer) {
  assert(this.timers[0].uid.uid === timer.uid.uid);
  this.timers.splice(0, 1);
};

TimerRepository.prototype.nextTimer = function() {
  return this.timers[0];
};

module.exports = TimerRepository;