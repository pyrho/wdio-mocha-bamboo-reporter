var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var util = require('util');
var events = require('events');

var BuildTestResult = require('./TestResult')

var MochaBambooReporter = function(baseReporter, config, options) {

    this.baseReporter = baseReporter;
    this.config = config;
    this.options = options;
    var self = this;

    var epilogue = this.baseReporter.epilogue;

    this.on('end', function() {
        // statistics about overall execution results
        const stats = {
            suites: 0,
            tests: 0,
            passes: 0,
            pending: 0,
            failures: 0,
            start: self.baseReporter.stats.start,
            end: self.baseReporter.stats.end,
            duration: self.baseReporter.stats._duration,
        };

        // structure for mochawesome json reporter
        const results = {
            stats: stats,
            skipped: [],
            passes: [],
            failures: [],
        };

        // runner loop
        for (let cid of Object.keys(self.baseReporter.stats.runners)) {
            let runnerInfo = self.baseReporter.stats.runners[cid]
            let sanitizedCapabilities = runnerInfo.sanitizedCapabilities

            // specs loop
            for (let specId of Object.keys(runnerInfo.specs)) {
                let specInfo = runnerInfo.specs[specId]

                // suites loop
                for (let suiteName of Object.keys(specInfo.suites)) {
                    var suiteInfo = specInfo.suites[suiteName]

                    // exclude before all and after all 'suites'
                    if (!suiteInfo.uid.includes('before all') && !suiteInfo.uid.includes('after all') && Object.keys(suiteInfo.tests).length > 0) {

                        // tests loop
                        for (let testName of Object.keys(suiteInfo.tests)) {
                            let testResult = BuildTestResult(suiteInfo.tests[testName]);
                            if (testResult.pass) {
                                results.passes.push(testResult)
                                results.stats.passes++;
                            } else if (testResult.fail) {
                                results.failures.push(testResult)
                                results.stats.failures++;
                            } else if (testResult.pending) {
                                results.skipped.push(testResult)
                                results.stats.pending++;
                            }

                            results.stats.tests++;
                        }

                        results.stats.suites++;
                    }
                }
            }
        }

        write(results)

        epilogue.call(baseReporter)
    });

    function write (json) {
        if (!self.options || typeof self.options.outputDir !== 'string') {
            return console.log(`Cannot write json report: empty or invalid 'outputDir'.`)
        }

        try {
            var dir = path.resolve(self.options.outputDir);
            var filename = self.options.filename ? self.options.filename : 'mocha.json';
            var filepath = path.join(dir, filename);
            mkdirp.sync(dir);
            fs.writeFileSync(filepath, JSON.stringify(json));
            console.log(`Wrote json report to [${self.options.outputDir}].`);
        } catch (e) {
            console.log(`Failed to write json report to [${self.options.outputDir}]. Error: ${e}`);
        }
    }
};

util.inherits(MochaBambooReporter, events.EventEmitter);
exports = module.exports = MochaBambooReporter;
