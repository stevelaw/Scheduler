describe("Scheduler", function() {
	var scheduler = null;
	var intervalWaitMultiplier = 4;

	beforeEach(function() {
		scheduler = new Scheduler({
			debug: true
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
		var jobName = "test";
		
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
			scheduler.removeJob(jobName);
			
			expect(fired).toEqual(true);
		});
	});
});