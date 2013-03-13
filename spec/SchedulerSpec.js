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
			var success = scheduler.removeJob(jobName);

			expect(fired).toEqual(true);
			expect(success).toEqual(true);
		});
	});

	it('can add a job and call multiple callbacks', function() {
		var fired = 0;
		var interval = 500;
		var jobName = "test";

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
});