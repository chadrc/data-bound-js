
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
    name: "PropStrings",
    getData: () => {
        return {
            mainContext: {
                helloProp: "Hello World!",
                myProp: "My Prop",
                nullProp: null,
                numberProp: 2000,
                booleanProp: true,
                parentProp: {
                    nestedProp: "Nested Prop"
                },
                methodProp() {
                    return "Method Prop";
                },
                get getProp() {
                    return "Gotten Prop";
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
            method(data) {
                let propStr = new DataBoundPropString("${myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, data.mainContext.myProp);
            }
        },
        {
            name: "Multi Prop String Render",
            method(data) {
                let propStr = new DataBoundPropString("${myProp} is ${helloProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, data.mainContext.myProp + " is " + data.mainContext.helloProp);

            }
        },
        {
            name: "Self Prop String Render",
            method(data) {
                let propStr = new DataBoundPropString("${.myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext, data.selfContext, data.rootContext);
                assertExpectedValue(renderStr, data.selfContext.myProp);
            }
        },
        {
            name: "Root Prop String Render",
            method(data) {
                let propStr = new DataBoundPropString("${~myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext, data.selfContext, data.rootContext);
                assertExpectedValue(renderStr, data.rootContext.myProp);
            }
        },
        {
            name: "Method Call Render",
            method(data) {
                let propStr = new DataBoundPropString("${methodProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, data.mainContext.methodProp());
            }
        },
        {
            name: "Getter Prop",
            method(data) {
                let propStr = new DataBoundPropString("${getProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, data.mainContext.getProp);
            }
        },
        {
            name: "Multi Same Prop Render",
            todo: "Refactor prop extraction and strings so duplicated props aren't stored twice.",
            method(data) {
                let propStr = new DataBoundPropString("${myProp} ${myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, data.mainContext.myProp + " " + data.mainContext.myProp);
            }
        },
        {
            name: "Nested Props Single Depth",
            todo: "Research 'pre-compiling' nested props.",
            method(data) {
                let propStr = new DataBoundPropString("${parentProp.nestedProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, data.mainContext.parentProp.nestedProp);
            }
        },
        {
            name: "Undefined Prop",
            method(data) {
                let propStr = new DataBoundPropString("${undefinedProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, 'undefined');
            }
        },
        {
            name: "Prop of Undefined Prop",
            method(data) {
                let propStr = new DataBoundPropString("${undefinedProp.nonexistentProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, 'undefined');
            }
        },
        {
            name: "Null Prop",
            method(data) {
                let propStr = new DataBoundPropString("${nullProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, 'null');
            }
        },
        {
            name: "Prop of Null Prop",
            method(data) {
                let propStr = new DataBoundPropString("${nullProp.nonexistentProp}");
                let renderStr = propStr.renderWithContext(data.mainContext);
                assertExpectedValue(renderStr, 'undefined');
            }
        },
        {
            name: "Get Prop Value",
            method(data) {
                let propStr = new DataBoundPropString("${numberProp} ${booleanProp} ${myProp}");
                let numberValue = propStr.getValueWithContext(0, data.mainContext, data.selfContext, data.rootContext);
                assertExpectedValue(numberValue, data.mainContext.numberProp);
                let booleanValue = propStr.getValueWithContext(1, data.mainContext, data.selfContext, data.rootContext);
                assertExpectedValue(booleanValue, data.mainContext.booleanProp);
                let stringValue = propStr.getValueWithContext(2, data.mainContext, data.selfContext, data.rootContext);
                assertExpectedValue(stringValue, data.mainContext.myProp);
            }
        }
    ]
});

TestSuites.suites.push({
    name: "Bindings",
    getData() {
        let element = document.createElement('div');
        element.setAttribute('class', '${classes}');
        element.setAttribute('hidden', '${isHidden}');
        element.setAttribute('disabled', '${numValue}');
        element.setAttribute('onclick', '${raiseClick}');
        element.innerHTML = "Description: ${description}";
        return {
            element: element,
            context: {
                classes: "alert-warning",
                isHidden: true,
                numValue: 5,
                raiseClick() {
                    element.setAttribute('class', 'alert-info');
                },
                description: "Basic element binding example."
            }
        }
    },
    tests: [
        {
            name: "Attribute Binding",
            method(data) {
                let attrBinding = new DataBoundAttribute(data.element.attributes.class);
                attrBinding.renderWithContext(data.context);
                assertExpectedValue(data.element.attributes.class.nodeValue, data.context.classes);
                data.context.classes = "alert alert-info";
                attrBinding.renderWithContext(data.context);
                assertExpectedValue(data.element.attributes.class.nodeValue, data.context.classes);
            }
        },
        {
            name: "Boolean Binding",
            method(data) {
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.hidden);
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.hidden && data.element.attributes.hidden.nodeValue == "",
                    "Expected hidden attribute to exist with an empty string as its value.");
                data.context.isHidden = false;
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.hidden, "Expected hidden attribute to not exist.");
            }
        },
        {
            name: "Text Binding",
            method(data) {
                let textBinding = new DataBoundTextNode(data.element.childNodes[0]);
                textBinding.renderWithContext(data.context);
                assertExpectedValue(data.element.childNodes[0].nodeValue, "Description: " + data.context.description);
                data.context.description = "Another description.";
                textBinding.renderWithContext(data.context);
                assertExpectedValue(data.element.childNodes[0].nodeValue, "Description: " + data.context.description);
            }
        },
        {
            name: "Method Binding",
            method(data) {
                let methodBinding = new DataBoundMethodAttribute(data.element.attributes.onclick);
                methodBinding.renderWithContext(data.context);
                data.element.click();
                assertExpectedValue(data.element.attributes.class.value, "alert-info");
                assert(!data.element.attributes.onclick, "Expected 'onclick' attribute to have been removed.");
                assertExpectedValue(data.element.attributes['data-bound-method-onclick'].value, "Object.raiseClick");
            }
        },
        {
            name: "Boolean Binding Conditionals - Equals",
            method(data) {
                data.element.setAttribute('data-bound-disabled-eq', '4');
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.disabled, "Expected 'disabled' attribute to be removed.");

                data.element.setAttribute('data-bound-disabled-eq', '5');
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.disabled && data.element.attributes.disabled.nodeValue == "",
                    "Expected 'disabled' attribute to exists with empty string as its value.");
            }
        }
    ]
});