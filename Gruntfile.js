module.exports = function(grunt) {

	/*
	 * Variables
	 */
	var src = 'src/**/*.js';
	var specs = 'spec/*Spec.js';

	/*
	 * Config
	 */
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		jasmine : {
			pivotal : {
				src : src,
				options : {
					specs : specs,
					helpers : 'spec/*Helper.js'
				}
			}
		},
		watch : {
			files : [ src, specs ],
			tasks : [ 'jasmine', 'growl:jasmine' ]
		},
		growl : {
			jasmine : {
				message : '<%= jasmine.message %>',
				title : "Jasmine Test Results",
				image : __dirname + '/spec/images/jasmine_logo.png'
			}
		},
		jshint : {
			options : {
				jshintrc : '.jshintrc',
			},
			all : src,

		},

		uglify : {
			options : {
				mangle : false
			},
			all : {
				files : {
					'<%= pkg.name %>.min.js' : src
				}
			}
		}
	});

	/*
	 * Load Tasks
	 */
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-growl');

	/*
	 * Register Tasks
	 */
	grunt.registerTask('default', [ 'jasmine', 'growl:jasmine', 'jshint:all',
			'uglify:all', 'watch' ]);

	/*
	 * Event Handlers
	 */
	grunt.event.on('jasmine.reportJUnitResults', function(results) {
		var suites = results.suites;

		var tests = suites.reduce(function(pVal, cVal) {
			return pVal + cVal.tests;
		}, 0);

		var errors = suites.reduce(function(pVal, cVal) {
			return pVal + cVal.errors;
		}, 0);

		var failures = suites.reduce(function(pVal, cVal) {
			return pVal + cVal.failures;
		}, 0);

		var passed = tests - failures;

		grunt.config.set('jasmine.message', passed + ' out of ' + tests
				+ ' passed');
	});
};
