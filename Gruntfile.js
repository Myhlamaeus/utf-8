/* jshint node:true */

"use strict";

module.exports = function (grunt) {
    // Show elapsed time at the end
    require("time-grunt")(grunt);
    // Load all grunt tasks
    require("load-grunt-tasks")(grunt);

    // Project configuration.
    grunt.initConfig({
        "config": {
            "main": "utf-8",
            "global": "utf8"
        },
        "watch": {
            "gruntfile": {
                "files": "<%= jshint.gruntfile.src %>",
                "tasks": ["jshint:gruntfile"]
            },
            "js": {
                "files": "<%= config.main %>.js",
                "tasks": ["jshint:main", "nodeunit"]
            },
            "jstest": {
                "files": ["test/{,*/}*.js"],
                "tasks": ["jshint", "mocha"]
            }
        },
        "jshint": {
            "options": {
                "jshintrc": ".jshintrc",
                "reporter": require("jshint-stylish")
            },
            "gruntfile": {
                "src": "Gruntfile.js"
            },
            "main": [
                "<%= config.main %>.js"
            ],
            "test": {
                "options": {
                    "jshintrc": "test/.jshintrc"
                },
                "files": {
                    "src": ["test/{,*/}*.js"]
                }
            }
        },
        "mochaTest": {
            "test": {
                "options": {
                    "reporter": "spec",
                    "captureFile": "errors.txt"
                },
                "src": ["test/index.js"]
            }
        }
    });

    grunt.registerTask("test", ["jshint", "mochaTest"]);
};
