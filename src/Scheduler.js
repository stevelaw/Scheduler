;
/**
 * 
 * @author Steve Lawson
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

	/*
	 * Job mapping.
	 */
	var jobs = {};

	/*
	 * Job constructor function.
	 */
	var Job = function(options) {

	};

	/*
	 * Job Prototype.
	 */
	Job.prototype = {

		// Job state constants.
		STATES : {
			SCHEDULED : 1,
			RUNNING : 2,
			PAUSED : 3
		},

		// Current state.
		state : Job.prototype.STATES.SCHEDULED,

		// Callback(s)
		fn : function() {
		},

		// Whether the job should persist acrossed pauses and remove all calls.
		persist : false,

		// Interval at which the job is run.
		interval : 9999,

		timerHandle : null,

		timerHandler : function() {
			this.state = this.STATES.RUNNING;

			// Put stuff here

			this.state = this.STATES.SCHEDULED;
		},

		pause : function() {
			this.timerHandle && clearInterval(this.timerHandle);

			this.state = this.STATES.PAUSED;
		},

		stop : function() {
			this.timerHandle && clearInterval(this.timerHandle);
		},

		start : function(immediate) {
			this.timerHandle = setInterval(this.timerHandler, this.interval);

			this.state = this.STATES.SCHEDULED;

			immediate && this.timerHandler();
		}
	};

	/**
	 * 
	 * @param options.name
	 *            Job name
	 * 
	 * @param options.interval
	 *            Interval How often the job should run
	 * 
	 * @param options.fn
	 *            Single function reference or array of references to be called
	 *            when the timer fires.
	 * 
	 * @param options.immediate
	 *            Execute the function immediately.
	 * 
	 * @param options.persist
	 *            Prevents job from being paused via pauseAllJobs() or
	 *            removeAllJobs() methods.
	 */
	var addJob = function(options) {
		if (typeof options.name === 'undefined') {
			throw Error("Job name is required");
		}

		if (typeof options.fn === 'undefined') {
			throw Error("Job callbacks are required");
		}

		jobs[options.name] = new Job(options);
	};

	/**
	 * 
	 */
	var removeJob = function(name) {

	};

	/**
	 * 
	 */
	var runJob = function(name) {

	};

	/**
	 * 
	 */
	var pauseJob = function(name) {

	};

	/**
	 * 
	 */
	var resumeJob = function(name) {

	};

	/**
	 * 
	 */
	var removeAllJobs = function() {

	};

	/**
	 * 
	 */
	var pauseAllJobs = function() {

	};

	/**
	 * 
	 */
	var resumeAllJobs = function() {

	};

	/*
	 * Public API
	 */
	return {
		addJob : addJob,
		removeJob : removeJob,
		runJob : runJob,
		pauseJob : pauseJob,
		resumeJob : resumeJob,
		removeAllJobs : removeAllJobs,
		pauseAllJobs : pauseAllJobs,
		resumeAllJobs : resumeAllJobs
	};
}));