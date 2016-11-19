/**
 * Created by chad on 11/16/16.
 */

// Assertions

function assert(condition, failMessage) {
    if (!condition) {
        throw "Assertion failed: " + failMessage;
    }
}

function assertExpectedValue(value, expected, msgPrefix, msgSuffix) {
    assert(value == expected, (msgPrefix || '') + "Expected '" + expected + "', got '" + value + "'" + (msgSuffix || ''))
}

// Test Setup and Display

let TestSuites = {
    applicationName: "Test Application",
    suites: []
};

window.addEventListener('load', function () {
    initTestDisplay();
});

function initTestDisplay() {
    createTestDisplay();

    for (let i=0; i<TestSuites.suites.length; i++) {
        let suite = TestSuites.suites[i];
        runSuite(i);
    }
}

function runTest(suiteNo, testNo) {
    let suite = TestSuites.suites[suiteNo];
    let test = suite.tests[testNo];
    try {
        let data;
        if (suite.getData && suite.getData instanceof Function) {
            data = suite.getData();
        }
        test.method(data);
        test.setSuccess();
        return true;
    } catch (err) {
        test.setError(err);
        console.error(err);
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

function todoCount() {
    let count = 0;
    for (let i=0; i<TestSuites.suites.length; i++) {
        let suite = TestSuites.suites[i];
        for (let j=0; j<suite.tests.length; j++) {
            let test = suite.tests[j];
            if (test.todo) {
                if (test.todo instanceof Array) {
                    count += test.todo.length;
                } else {
                    count++;
                }
            }
        }
    }
    return count;
}

function createTestDisplay() {
    let root = document.createElement('div');
    root.setAttribute('class', 'p-1');

    let header = document.createElement('h1');
    header.innerHTML = TestSuites.applicationName;

    let todoBtn = document.createElement('button');
    todoBtn.setAttribute('type', 'button');
    todoBtn.setAttribute('class', 'btn btn-info ml-1');
    todoBtn.setAttribute('data-toggle', 'modal');
    todoBtn.setAttribute('data-target', '#todoModal');
    todoBtn.innerHTML = "TODO&nbsp;";

    let todoBtnTag = document.createElement('span');
    todoBtnTag.setAttribute('class', 'tag tag-primary tag-pill');
    todoBtnTag.innerHTML = todoCount();

    todoBtn.appendChild(todoBtnTag);

    header.appendChild(todoBtn);

    root.appendChild(header);

    for (let i=0; i<TestSuites.suites.length; i++) {
        let suite = TestSuites.suites[i];
        let suiteRoot = document.createElement('div');
        suiteRoot.setAttribute('class', 'card clearfix');

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
            testRoot.setAttribute('class', 'card-block col-lg-6');

            let testContent = document.createElement('div');
            testContent.setAttribute('id', testId + "Content");
            testContent.setAttribute('class', 'p-1 rounded card-inverse card-info');

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

            testContent.appendChild(testHeader);
            testContent.appendChild(testMessage);

            testRoot.appendChild(testContent);

            let testQuery =  "#" + testId+ "Content";
            test.setError = (msg) => {
                $(testQuery).switchClass('card-info', 'card-danger');
                testMessage.innerHTML = msg;
            };
            test.setSuccess = () => {
                $(testQuery).switchClass('card-info', 'card-success');
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
    createTodoModal();
}

function createTodoModal() {
    let root = document.createElement('div');
    root.setAttribute('class', 'modal fade bd-example-modal-lg');
    root.setAttribute('id', 'todoModal');
    root.setAttribute('tabIndex', '-1');
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-labelledby', 'todoTitle');

    let modal = document.createElement('div');
    modal.setAttribute('class', 'modal-dialog modal-lg');
    modal.setAttribute('role', 'document');

    let modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content');

    let modalHeader = document.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');

    let closeBtn = document.createElement('button');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('class', 'close');
    closeBtn.setAttribute('data-dismiss', 'modal');
    closeBtn.setAttribute('aria-label', 'Close');

    let closeBtnContent = document.createElement('span');
    closeBtnContent.setAttribute('aria-hidden', 'true');
    closeBtnContent.innerHTML = "&times;";

    closeBtn.appendChild(closeBtnContent);

    let modalTitle = document.createElement('h4');
    modalTitle.setAttribute('class', 'modal-title');
    modalTitle.setAttribute('id', 'todoTitle');
    modalTitle.innerHTML = "TODO";

    modalHeader.appendChild(closeBtn);
    modalHeader.appendChild(modalTitle);

    let modalBody = document.createElement('div');
    modalBody.setAttribute('class', 'modal-body');

    for (let i=0; i<TestSuites.suites.length; i++) {
        let suite = TestSuites.suites[i];
        let suiteAppend = false;
        let suiteHeader = document.createElement('h5');
        suiteHeader.innerHTML = suite.name;
        let suiteListRoot = document.createElement('ul');
        for (let j=0; j<suite.tests.length; j++) {
            let testAppend = false;
            let test = suite.tests[j];
            let testListItem = document.createElement('li');
            testListItem.innerHTML = test.name;
            let testListRoot = document.createElement('ul');
            if (test.todo) {
                if (test.todo instanceof Array) {
                    for (let k=0; k<test.todo.length; k++) {
                        let todo = test.todo[k];
                        let todoItem = document.createElement('li');
                        todoItem.innerHTML = todo;
                        testListRoot.appendChild(todoItem);
                        testAppend = true;
                    }
                } else {
                    let todoItem = document.createElement('li');
                    todoItem.innerHTML = test.todo;
                    testListRoot.appendChild(todoItem);
                    testAppend = true;
                }
            }
            if (testAppend) {
                testListItem.appendChild(testListRoot);
                suiteListRoot.appendChild(testListItem);
                testAppend = true;
                suiteAppend = true;
            }
        }

        if (suiteAppend) {
            modalBody.appendChild(suiteHeader);
            modalBody.appendChild(suiteListRoot);
        }
    }

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    modal.appendChild(modalContent);

    root.appendChild(modal);

    document.body.appendChild(root);
}