
TestSuites.applicationName = "DataBoundJs";

TestSuites.suites.push({
    name: "Utils",
    tests: [
        {
            name: "Extract Single Prop",
            method: () => {
                const cases = [
                    {prop: "${myProp}",
                        expected: {expectedProp: "myProp", expectedMatch: "${myProp}"}}, // 0
                    {prop: "  ${myProp}  ",
                        expected: {expectedProp: "myProp", expectedMatch: "${myProp}"}}, // 1
                    {prop: "${  myProp  }",
                        expected: {expectedProp: "myProp", expectedMatch: "${  myProp  }"}}, // 2
                    {prop: "${~rootProp}",
                        expected: {expectedProp: "rootProp", expectedMatch: "${~rootProp}", expectedRoot: true}}, // 3
                    {prop: "${root~Prop}", expected: null}, // 4
                    {prop: "${rootProp~}", expected: null}, // 5
                    {prop: "${myProp.subProp}",
                        expected: {expectedProp: "myProp.subProp", expectedMatch: "${myProp.subProp}"}}, // 6
                    {prop: "${.myProp.subProp}",
                        expected: {expectedProp: "myProp.subProp", expectedMatch: "${.myProp.subProp}", expectedSelf: true}}, // 7
                    {prop: "${myProp.}", expected: null}, // 8
                    {prop: "${~.myProp}", expected: null}, // 9
                    {prop: "${.~myProp}", expected: null}, // 10
                    {prop: "not props ${aProp}",
                        expected: {expectedProp: "aProp", expectedMatch: "${aProp}"}}, // 11
                    {prop: "${no spaces}", expected: null}, // 12
                    {prop: "${seci@lCh@r@cters}", expected: null} // 13
                ];

                for (let i = 0; i < cases.length; i++) {
                    let pair = cases[i];
                    let props = DataBoundUtils.extractPropsFromString(pair.prop);
                    if (pair.expected == null) {
                        assert(props.length == 0, i + ": Expecting no match, got ", props);
                    } else {
                        props = props[0];
                        if (pair.expectedRoot) {
                            assert(props.rootRef == true, i + ": Expected to be root ref.");
                        }
                        if (pair.expectedSelf) {
                            assert(props.selfRef == true, i + ": Expected to be self ref.");
                        }
                        assert(props.prop == pair.expected.expectedProp, i + ": Extracted prop should be '" +
                            pair.expected.expectedProp + "', got '" + props.prop + "'");
                        assert(props.match == pair.expected.expectedMatch, i + ": Extracted match should be '" +
                            pair.expected.expectedMatch + "', got '" + props.match + "'");
                    }
                }
            },
        },
        {
            name: "Extract Multiple Props",
            method: () => {
                let cases = [
                    {str: "no props at all", expectedCount: 0},
                    {str: "${onlyProp}", expectedCount: 1,
                        expectedMatches: [{prop: "onlyProp", match: "${onlyProp}"}]},
                    {str: "${firstProp} some middle text ${secondProp}", expectedCount: 2,
                        expectedMatches: [{prop: "firstProp", match: "${firstProp}"},
                            {prop: "secondProp", match: "${secondProp}"}]},
                    {str: "${firstProp ${secondProp}}", expectedCount: 1,
                        expectedMatches: [{prop: "secondProp", match: "${secondProp}"}]},
                    {str: "${firstProp ${secondProp}", expectedCount: 1,
                        expectedMatches: [{prop: "secondProp", match: "${secondProp}"}]},
                ];

                for (let i = 0; i < cases.length; i++) {
                    let pair = cases[i];
                    let props = DataBoundUtils.extractPropsFromString(pair.str);
                    assert(props.length == pair.expectedCount,
                        i + ": Expected " + pair.expectedCount + " props, got " + props.length);
                    if (pair.expectedCount > 0) {
                        for (let j=0; j<pair.expectedCount; j++) {
                            assert(pair.expectedMatches[j].prop == props[j].prop
                                && pair.expectedMatches[j].match == props[j].match,
                                j + ": Expected ", pair.expectedMatches[j], + ", got ", props[j]);
                        }
                    }
                }
            },
        }
    ]
});

TestSuites.suites.push({
    name: "Bound Prop String",
    getData: () => {
        return {
            mainContext: {
                helloProp: "Hello World!",
                myProp: "My Prop",
                parentProp: {
                    nestedProp: "Nested Prop"
                },
                methodProp: () => {
                    return "Method Prop";
                }
            },
            selfContext: {
                myProp: "My Self Prop"
            },
            rootContext: {
                myProp: "My Root Prop"
            }
        }
    },
    tests: [
        {
            name: "Single Prop String Render",
            method: (data) => {
                let propStr = new DataBoundPropString("${myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assert(renderStr == data.mainContext.myProp,
                    "Expected " + data.mainContext.myProp + ", got " + renderStr);
            }
        },
        {
            name: "Multi Prop String Render",
            method: (data) => {
                let propStr = new DataBoundPropString("${myProp} is ${helloProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assert(renderStr == data.mainContext.myProp + " is " + data.mainContext.helloProp,
                    "Expected " + data.mainContext.myProp + " is " + data.mainContext.helloProp + ", got " + renderStr);
            }
        },
        {
            name: "Self Prop String Render",
            method: (data) => {
                let propStr = new DataBoundPropString("${.myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext, data.selfContext, data.rootContext);
                assert(renderStr == data.selfContext.myProp,
                    "Expected " + data.selfContext.myProp + ", got " + renderStr);
            }
        },
        {
            name: "Root Prop String Render",
            method: (data) => {
                let propStr = new DataBoundPropString("${~myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext, data.selfContext, data.rootContext);
                assert(renderStr == data.rootContext.myProp,
                    "Expected " + data.rootContext.myProp + ", got " + renderStr);
            }
        },
        {
            name: "Method Call Render",
            method: (data) => {
                let propStr = new DataBoundPropString("${methodProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                let expected = data.mainContext.methodProp();
                assert(renderStr == expected, "Expected " + expected + ", got " + renderStr);
            }
        },
        {
            name: "Multi same prop render",
            todo: "Refactor prop extraction and strings so duplicated props aren't stored twice.",
            method: (data) => {
                let propStr = new DataBoundPropString("${myProp} ${myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                let expected = data.mainContext.myProp + " " + data.mainContext.myProp;
                assert(renderStr == expected, "Expected " + expected + ", got " + renderStr);
            }
        },
        {
            name: "Nested props single depth",
            todo: "Research 'pre-compiling' nested props.",
            method: (data) => {
                let propStr = new DataBoundPropString("${parentProp.nestedProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                let expected = data.mainContext.parentProp.nestedProp;
                assert(renderStr == expected, "Expected " + expected + ", got " + renderStr);
            }
        }
    ]
});