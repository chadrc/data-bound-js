/**
 * Created by chad on 11/16/16.
 */

function assert(condition, failMessage) {
    if (!condition) {
        throw "Assertion failed: " + failMessage;
    }
}

function runTest(suiteNo, testNo) {
    let suite = TestSuites.suites[suiteNo];
    let test = suite.tests[testNo];
    try {
        test.method();
        test.setSuccess();
        return true;
    } catch (err) {
        test.setError(err);
        return false;
    }
}

function runSuite(suiteNo) {
    let suite = TestSuites.suites[suiteNo];
    let successCount = 0;
    let failCount = 0;
    for (let i=0; i<suite.tests.length; i++) {
        if (runTest(suiteNo, i)) {
            successCount++;
        } else {
            failCount++;
        }
    }
    suite.setStatus(failCount, successCount);
    return {successCount: successCount, failCount: failCount};
}

function createTestDisplay() {
    let root = document.createElement('div');
    let header = document.createElement('h1');
    header.innerHTML = TestSuites.applicationName;
    root.appendChild(header);

    for (let i=0; i<TestSuites.suites.length; i++) {
        let suite = TestSuites.suites[i];
        let suiteRoot = document.createElement('div');
        suiteRoot.setAttribute('class', 'card');

        let suiteHeader = document.createElement('div');
        suiteHeader.setAttribute('class', 'card-header ');

        let suiteRunBtn = document.createElement('button');
        suiteRunBtn.setAttribute('hidden', '');
        suiteRunBtn.setAttribute('type', 'button');
        suiteRunBtn.setAttribute('class', 'btn btn-secondary mr-1');
        suiteRunBtn.innerHTML = "Run";

        let suiteName = document.createElement('a');
        suiteName.setAttribute('class', 'h2 align-middle');
        suiteName.innerHTML = suite.name;
        suiteName.setAttribute('data-toggle', 'collapse');
        let suiteToggleId = "Suite" + i + "CollapseToggle";
        suiteName.setAttribute('href', "#" + suiteToggleId);
        suiteName.setAttribute('aria-expanded', 'false');
        suiteName.setAttribute('aria-controls', suiteToggleId);

        let failAlert = document.createElement('span');
        failAlert.setAttribute('class', 'alert alert-danger ml-1');
        failAlert.setAttribute('hidden', '');

        let successAlert = document.createElement('span');
        successAlert.setAttribute('class', 'alert alert-success ml-1');
        successAlert.setAttribute('hidden', '');

        suite.setStatus = (failCount, successCount) => {
            failAlert.removeAttribute('hidden');
            failAlert.innerHTML = failCount + " Failed";

            successAlert.removeAttribute('hidden');
            successAlert.innerHTML = successCount + " Succeeded"

            if (failCount > 0) {
                $("#"+suiteToggleId).collapse('show');
            }
        };

        suiteHeader.appendChild(suiteRunBtn);
        suiteHeader.appendChild(suiteName);
        suiteHeader.appendChild(failAlert);
        suiteHeader.appendChild(successAlert);

        suiteRoot.appendChild(suiteHeader);

        let suiteTestContainer = document.createElement('div');
        suiteTestContainer.setAttribute('class', 'collapse');
        suiteTestContainer.setAttribute('id', suiteToggleId);

        for (let j=0; j<suite.tests.length; j++) {
            let test = suite.tests[j];

            let testId = "suite" + i + "-test" + j;
            let testRoot = document.createElement('div');
            testRoot.setAttribute('id', testId);
            testRoot.setAttribute('class', 'card-block m-1 rounded card-inverse card-info');

            let testHeader = document.createElement('h5');
            testHeader.setAttribute('class', 'card-title');

            let testRunBtn = document.createElement('button');
            testRunBtn.setAttribute('hidden', '');
            testRunBtn.setAttribute('type', 'button');
            testRunBtn.setAttribute('class', 'btn btn-secondary btn-sm mr-1');
            testRunBtn.innerHTML = "Run";

            let testName = document.createElement('span');
            testName.setAttribute('class', 'align-middle');
            testName.innerHTML = test.name;

            testHeader.appendChild(testRunBtn);
            testHeader.appendChild(testName);

            let testMessage = document.createElement('p');
            testMessage.setAttribute('class', 'card-text');
            testMessage.innerHTML = "Not Run";

            testRoot.appendChild(testHeader);
            testRoot.appendChild(testMessage);

            test.setError = (msg) => {
                $("#"+testId).switchClass('card-info', 'card-danger');
                testMessage.innerHTML = msg;
            };
            test.setSuccess = () => {
                $("#"+testId).switchClass('card-info', 'card-success');
                testMessage.innerHTML = "Success";
            };

            testRunBtn.addEventListener('click', () => runTest(i, j));

            suiteTestContainer.appendChild(testRoot);
        }

        suiteRoot.appendChild(suiteTestContainer);

        suiteRunBtn.addEventListener('click', () => runSuite(i));

        root.appendChild(suiteRoot);
    }

    document.body.appendChild(root);
}

let TestSuites = {
    applicationName: "Test Application",
    suites: []
};

window.addEventListener('load', function () {
    createTestDisplay();

    for (let i=0; i<TestSuites.suites.length; i++) {
        let suite = TestSuites.suites[i];
        runSuite(i);
    }
});