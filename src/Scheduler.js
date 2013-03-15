/**
 * 
 */
(function(root, factory) {
	if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory;
	} else if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else {
		// Browser globals (root is window)
		root.Scheduler = factory;
	}
}(this, function(options) {

	var debug = options.debug || false;

	/*
	 * Log helper.
	 */
	var log = function(str) {
		if (debug && console && console.log) {
			console.log(str);
		}
	};

	/*
	 * Error helper.
	 */
	var throwError = function(message) {
		throw new Error(message);
	};

	/*
	 * Job mapping.
	 * 
	 * Job Name => Job
	 */
	var jobs = {};

	/*-----------------
	 * Job constructor
	 *-----------------*/
	var Job = function(options) {
		// Validation
		if (typeof options.name === 'undefined') {
			throwError("Job name is required");
		}

		if (typeof options.fn === 'undefined') {
			throwError("Job callbacks are required");
		}

		this.state = this.STATES.INIT;
		this.persist = options.persist || false;
		this.interval = options.interval;
		this.immediate = options.immediate || false;
		this.name = options.name;
		this.persist = options.persist || false;

		// Convert to array if not already.
		this.fns = options.fn;
		if (!(options.fn instanceof Array)) {
			this.fns = [ options.fn ];
		}

		this.start(true);
	};

	/*---------------
	 * Job Prototype
	 *---------------*/
	Job.prototype = {

		// Job state constants.
		STATES : {
			INIT : 1,
			SCHEDULED : 2,
			RUNNING : 3,
			PAUSED : 4,
			STOPPED : 5
		},

		name : "",

		// Whether it should continue running after removeAllJobs() and
		// pauseAllJobs()
		persist : false,

		// Current state.
		state : 1,

		// Callback(s)
		fns : [],

		// Interval at which the job is run.
		interval : 0,

		// Whether the job should be executed immediately after being scheduled.
		immediate : false,

		timerHandle : null,

		execute : function() {
			log("Running job: " + this.name);

			this.state = this.STATES.RUNNING;

			// Used to solve the closure-in-the-loop problem.
			var callbacker = function(fn) {
				setTimeout(function() {
					fn();
				}, 0);
			};

			// Loop through each callback and execute.
			for ( var i = 0, len = this.fns.length; i < len; i++) {
				callbacker(this.fns[i]);
			}

			this.state = this.STATES.SCHEDULED;
		},

		pause : function() {
			if (this.timerHandle) {
				log("Pausing job: " + this.name);

				clearInterval(this.timerHandle);
				this.timerHandle = null;
				this.state = this.STATES.PAUSED;
			}
		},

		stop : function() {
			if (this.timerHandle) {
				log("Stopping job: " + this.name);

				clearInterval(this.timerHandle);
				this.timerHandle = null;
				this.state = this.STATES.STOPPED;
			}
		},

		start : function(immediate) {
			if (this.timerHandle === null) {
				log("Starting job: " + this.name);

				var that = this;
				this.timerHandle = setInterval(function() {
					that.execute();
				}, this.interval);

				this.state = this.STATES.SCHEDULED;
				this.immediate && this.execute();
			} else {
				log("Job already started: " + this.name);
			}
		}
	};

	/*
	 * See JSDoc below.
	 */
	var addJob = function(options, replace) {
		var name = options.name;

		if (typeof jobs[name] === 'undefined' || replace) {
			jobs[name] = new Job(options);
		} else {
			log("Job name " + name + " is already added.");
		}
	};

	/*
	 * See JSDoc below.
	 */
	var removeJob = function(name) {
		var job = jobs[name];

		if (typeof job !== 'undefined') {
			job.stop();

			log("Removing job: " + name);

			delete jobs[name];

			return true;
		}

		return false;
	};

	/*
	 * See JSDoc below.
	 */
	var runJob = function(name) {
		var job = jobs[name];
		job && job.execute();
	};

	/*
	 * See JSDoc below.
	 */
	var pauseJob = function(name) {
		var job = jobs[name];
		job && job.pause();
	};

	/*
	 * See JSDoc below.
	 */
	var resumeJob = function(name) {
		var job = jobs[name];
		job && job.start();
	};

	/*
	 * Simple helper function.
	 */
	var forEachJob = function(fn) {
		for ( var jobName in jobs) {
			fn(jobName, job);
		}
	};

	/*
	 * See JSDoc below.
	 */
	var removeAllJobs = function() {
		forEachJob(function(name, job) {
			!job.persist && removeJob(jobName);
		});
	};

	/*
	 * See JSDoc below.
	 */
	var pauseAllJobs = function() {
		forEachJob(function(name, job) {
			!job.persist && pauseJob(jobName);
		});
	};

	/*
	 * See JSDoc below.
	 */
	var resumeAllJobs = function() {
		forEachJob(function(name, job) {
			resumeJob(jobName);
		});
	};

	/*
	 * Public API
	 */
	return {
		/**
		 * Add a job.
		 * 
		 * @param options.name
		 *            Job name
		 * 
		 * @param options.interval
		 *            Interval How often the job should run
		 * 
		 * @param options.fn
		 *            Single function reference or array of references to be
		 *            called when the timer fires.
		 * 
		 * @param options.immediate
		 *            Execute the function immediately.
		 * 
		 * @param options.persist
		 *            Prevents job from being paused via pauseAllJobs() or
		 *            removeAllJobs() methods.
		 * 
		 * @param replace
		 *            If a job by the name already exists, then replace it.
		 *            Defaults to false.
		 */
		addJob : addJob,

		/**
		 * Removes a job by name.
		 * 
		 * @param name
		 *            Job name to remove
		 * 
		 * @returns True is successfully removed, false otherwise.
		 */
		removeJob : removeJob,

		/**
		 * Immediately execute job.
		 * 
		 * @param name
		 *            Job name to run
		 */
		runJob : runJob,

		/**
		 * Pause job from firing.
		 * 
		 * @param name
		 *            Job name to pause
		 */
		pauseJob : pauseJob,

		/**
		 * Resume a paused job.
		 * 
		 * @param name
		 *            Job name to pause
		 */
		resumeJob : resumeJob,

		/**
		 * Removes all jobs.
		 */
		removeAllJobs : removeAllJobs,

		/**
		 * Pauses all jobs.
		 */
		pauseAllJobs : pauseAllJobs,

		/**
		 * Resumes all jobs.
		 */
		resumeAllJobs : resumeAllJobs
	};
}));