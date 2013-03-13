describe("Scheduler", function() {
	var scheduler = null;
	var intervalWaitMultiplier = 4;

	beforeEach(function() {
		scheduler = new Scheduler({
			debug : true
		});
	});

	it("should not be null", function() {
		expect(scheduler).not.toBeNull();
	});

	it("should be defined", function() {
		expect(scheduler).toBeDefined();
	});

	it('can add a job and call single callback', function() {
		var fired = false;
		var interval = 500;
		var jobName = "SingleJobSingleCallbackOnce";

		var callback = function() {
			fired = true;
		};

		scheduler.addJob({
			name : jobName,
			interval : interval,
			fn : callback
		});

		waitsFor(function() {
			return fired;
		}, 'Job never fired', interval * intervalWaitMultiplier);

		runs(function() {
			var success = scheduler.removeJob(jobName);

			expect(fired).toEqual(true);
			expect(success).toEqual(true);
		});
	});

	it('can add a job and call multiple callbacks', function() {
		var fired = 0;
		var interval = 500;
		var jobName = "SingleJobMultipleCallbacksOnce";

		var callbacks = [ function() {
			fired++;
		}, function() {
			fired++;
		} ];

		scheduler.addJob({
			name : jobName,
			interval : interval,
			fn : callbacks
		});

		waitsFor(function() {
			return fired === 2;
		}, 'Job never fired', interval * intervalWaitMultiplier);

		runs(function() {
			var success = scheduler.removeJob(jobName);

			expect(fired).toEqual(2);
			expect(success).toEqual(true);
		});
	});
	
	it('can add a job and call single callback multiple times', function() {
		var fired = 0;
		var interval = 500;
		var jobName = "SingleCallbackOnce";

		var callback = function() {
			fired++;
			
			if(fired === 5) {
				scheduler.removeJob(jobName);
			}
		};

		scheduler.addJob({
			name : jobName,
			interval : interval,
			fn : callback
		});

		waitsFor(function() {
			return fired === 5;
		}, 'Job never fired', interval * 10);

		runs(function() {
			expect(fired).toEqual(5);
		});
	});
	
	it('can add a job and call single callback multiple times', function() {
		var fired1 = 0, fired2 = 0;
		var interval = 500;
		var jobName = "MultiCallbackMulti";

		var callback1 = function() {
			console.log('callback1');
			
			fired1++;
			
			if(fired1 + fired2 === 10) {
				scheduler.removeJob(jobName);
			}
		};
		
		var callback2 = function() {
			console.log('callback2');
			
			fired2++;
			
			if(fired1 + fired2 === 10) {
				scheduler.removeJob(jobName);
			}
		};

		scheduler.addJob({
			name : jobName,
			interval : interval,
			fn : [ callback1, callback2 ]
		});

		waitsFor(function() {
			return fired1 + fired2 === 10;
		}, 'Job never fired', interval * 10);

		runs(function() {
			expect(fired1).toEqual(5);
			expect(fired2).toEqual(5);
		});
	});
});