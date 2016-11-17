/**
 * Created by chad on 11/16/16.
 */

function assert(condition, failMessage) {
    if (!condition) {
        throw "Assertion failed: " + failMessage;
    }
}

let TestSuites = {};

window.addEventListener('load', function () {
    let suites = Object.keys(TestSuites);
    for (let i=0; i<suites.length; i++) {
        let suiteName = suites[i];
        console.log("Starting Suite: " + suiteName);
        let suite = TestSuites[suiteName];
        let tests = Object.keys(suite);
        for (let j=0; j<tests.length; j++) {
            let testName = tests[j];
            console.log("testing: ", testName);
            let test = suite[testName];
            try {
                test();
                console.log("success");
            } catch (err) {
                console.error(err);
            }
        }
    }
});