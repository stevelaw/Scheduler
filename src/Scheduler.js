;
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
	
	var log = function(str) {
		if(debug && console && console.log) {
			console.log(str);
		}
	};
	
	/*
	 * Job mapping.
	 */
	var jobs = {};

	/*
	 * Job constructor function.
	 */
	var Job = function(options) {
		// Validation
		if (typeof options.name === 'undefined') {
			throw Error("Job name is required");
		}

		if (typeof options.fn === 'undefined') {
			throw Error("Job callbacks are required");
		}

		this.state = this.STATES.INIT;
		this.persist = options.persist || false;
		this.interval = options.interval;
		this.immediate = options.immediate || false;
		this.name = options.name;

		// Convert to array if not already.
		this.fns = options.fn;
		if (!(options.fn instanceof Array)) {
			this.fns = [ options.fn ];
		}

		this.start(true);
	};

	/*
	 * Job Prototype.
	 */
	Job.prototype = {

		// Job state constants.
		STATES : {
			INIT : 1,
			SCHEDULED : 2,
			RUNNING : 3,
			PAUSED : 4
		},

		name : "",
		
		// Current state.
		state : 1,

		// Callback(s)
		fns : [],

		// Whether the job should persist acrossed pauses and remove all calls.
		persist : false,

		// Interval at which the job is run.
		interval : 0,

		// Whether the job should be executed immediately after being scheduled.
		immediate : false,

		timerHandle : null,

		timerHandler : function() {
			log("Running job: " + this.name);
			
			this.state = this.STATES.RUNNING;

			for ( var i = 0, len = this.fns.length; i < len; i++) {
				var fn = this.fns[i];
				setTimeout(function() {
					fn();
				}, 0);
			}

			this.state = this.STATES.SCHEDULED;
		},

		pause : function() {
			log("Pausing job: " + this.name);
			
			this.timerHandle && clearInterval(this.timerHandle);
			this.state = this.STATES.PAUSED;
		},

		stop : function() {
			log("Stopping job: " + this.name);
			
			this.timerHandle && clearInterval(this.timerHandle);
		},

		start : function(immediate) {
			log("Starting job: " + this.name);
			
			var that = this;
			this.timerHandle = setInterval(function() {
				that.timerHandler();
			}, this.interval);
			
			this.state = this.STATES.SCHEDULED;
			this.immediate && this.timerHandler();
		}
	};

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
	 *            Single function reference or array of references to be called
	 *            when the timer fires.
	 * 
	 * @param options.immediate
	 *            Execute the function immediately.
	 * 
	 * @param options.persist
	 *            Prevents job from being paused via pauseAllJobs() or
	 *            removeAllJobs() methods.
	 * 
	 * @param replace
	 *            If a job by the name already exists, then replace it. Defaults
	 *            to false.
	 */
	var addJob = function(options, replace) {
		var name = options.name;

		if (typeof jobs[name] === 'undefined' || replace) {
			jobs[name] = new Job(options);
		} else {
			// Not sure I should throw an error here.
			throw Error("Job name " + name + " is already added.");
		}
	};

	/**
	 * Removes a job by name.
	 * 
	 * @param name Job name to remove
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