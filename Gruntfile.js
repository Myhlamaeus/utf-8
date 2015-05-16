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
        "mochaTest": {
            "test": {
                "options": {
                    "reporter": "spec",
                    "captureFile": "errors.txt"
                },
                "src": ["test/index.js"]
            }
        },
        "babel": {
            "options": {
                "sourceMap": true
            },
            "dist": {
                "files": {
                    "dist/cjs.js": "<%= config.main %>.js"
                }
            }
        },
        "browserify": {
            "dist": {
                "options": {
                    "browserifyOptions": {
                        "standalone": "<%= config.global %>"
                    }
                },
                "files": {
                    "dist/browser.js": "dist/cjs.js"
                }
            }
        },
        "uglify": {
            "dist": {
                "options": {
                    "screwIE8": true
                },
                "files": {
                    "dist/<%= config.main %>.min.js": "<%= config.main %>.js"
                }
            },
            "distCjs": {
                "files": {
                    "dist/cjs.min.js": "dist/cjs.js"
                }
            },
            "distBrowser": {
                "files": {
                    "dist/browser.min.js": "dist/browser.js"
                }
            }
        }
    });

    grunt.registerTask("test", ["mochaTest"]);

    grunt.task.registerTask("build:es6", ["uglify:dist"]);
    grunt.task.registerTask("build:cjs", ["babel:dist"]);
    grunt.task.registerTask("build:browser", ["babel:dist", "browserify:dist", "uglify:distBrowser"]);
};
