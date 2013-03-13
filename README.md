## What is it?

A simple job scheduler for managing periodic jobs.

## Dependencies

None

## API

```
addJob(options, replace)
	where 
		options.name
			Job name
			
		options.interval
			Interval How often the job should run
			
		options.fn
			Single function reference or array of references to be called
			when the timer fires.
			
		options.immediate
			Execute the function immediately.
			
		options.persist
			Prevents job from being paused via pauseAllJobs() or 
			removeAllJobs() methods.
		  
		 replace
			If a job by the name already exists, then replace it. Defaults to 
			false.
		
	returns 
		N/A

removeJob(jobName)
	where 
		jobName
			The name of the job to remove.
				
	returns
		True upon success, false otherwise.	
		
runJob(jobName)	

pauseJob(jobName)

resumeJob(jobName)

removeAllJobs()

pauseAllJobs()

resumeAllJobs()
```

## Usage

### Add a Job and a Single Callback
```javascript
var scheduler = new Scheduler();

scheduler.addJob({
	name : "name",
	interval : 1000,
	fn : function(){
		// I'll be called in approximately 1000ms		
	}
});	
```