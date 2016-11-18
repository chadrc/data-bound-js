/**
 * Created by chad on 11/16/16.
 */

function assert(condition, failMessage) {
    if (!condition) {
        throw "Assertion failed: " + failMessage;
    }
}

function runTestMethod(suiteNo, testNo) {

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
        suiteHeader.setAttribute('class', 'card-header');

        let suiteRunBtn = document.createElement('button');
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

        suiteHeader.appendChild(suiteRunBtn);
        suiteHeader.appendChild(suiteName);

        suiteRoot.appendChild(suiteHeader);

        let suiteTestContainer = document.createElement('div');
        suiteTestContainer.setAttribute('class', 'collapse');
        suiteTestContainer.setAttribute('id', suiteToggleId);

        for (let j=0; j<suite.tests.length; j++) {
            let test = suite.tests[j];

            let testRoot = document.createElement('div');
            testRoot.setAttribute('class', 'card-block m-1 rounded card-inverse card-info');

            let testHeader = document.createElement('h5');
            testHeader.setAttribute('class', 'card-title');

            let testRunBtn = document.createElement('button');
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

            suiteTestContainer.appendChild(testRoot);
        }

        suiteRoot.appendChild(suiteTestContainer);

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

    // let suites = Object.keys(TestSuites);
    // for (let i=0; i<suites.length; i++) {
    //     let suiteName = suites[i];
    //     console.log("Starting Suite: " + suiteName);
    //     let suite = TestSuites[suiteName];
    //     let tests = Object.keys(suite);
    //     for (let j=0; j<tests.length; j++) {
    //         let testName = tests[j];
    //         console.log("testing: ", testName);
    //         let test = suite[testName];
    //         try {
    //             test();
    //             console.log("success");
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    // }
});

/**
 <div>
     <h1>Application Name</h1>
     <div class="card">
         <div class="card-header">
             <button type="button" class="btn btn-secondary">Run</button>

             <span class="h2 align-middle">Suite Name</span>

             <button type="button" class="btn btn-secondary btn-sm"
             data-toggle="collapse"
             data-target="#suiteCollapse"
             aria-expanded="false"
             aria-controls="suiteCollapse">Toggle Tests</button>
         </div>
         <div class="collapse" id="suiteCollapse">
             <div class="card-block card-inverse card-danger m-1 rounded">
                 <h5 class="card-title">
                     <button type="button" class="btn btn-secondary btn-sm">Run</button>
                     <span class="align-middle">Test Name</span>
                 </h5>
                 <p class="card-text">Status Message</p>
             </div>
        </div>
     </div>
 </div>
 **/