
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
                dataBoundMethodProp(dataBoundContext) {
                    return dataBoundContext.myProp;
                },
                get getProp() {
                    return "Gotten Prop";
                }
            },
            parent: {
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
                let renderStr = propStr.renderWithContext(data.mainContext, data.parent, data.rootContext);
                assertExpectedValue(renderStr, data.parent.myProp);
            }
        },
        {
            name: "Root Prop String Render",
            method(data) {
                let propStr = new DataBoundPropString("${~myProp}");
                let renderStr = propStr.renderWithContext(data.mainContext, data.parent, data.rootContext);
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
            name: "Data Bound Method Call Render",
            method(data) {
                let propStr = new DataBoundPropString("${dataBoundMethodProp}");
                let renderStr = propStr.renderWithContext(data.mainContext, data.parent);
                assertExpectedValue(renderStr, data.parent.myProp);
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
            name: "Null Context",
            method(data) {
                let propStr = new DataBoundPropString("${myProp}");
                let renderStr = propStr.renderWithContext(null);
                assertExpectedValue(renderStr, 'undefined');
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
                let numberValue = propStr.getValueWithContext(0, data.mainContext, data.parent, data.rootContext);
                assertExpectedValue(numberValue, data.mainContext.numberProp);
                let booleanValue = propStr.getValueWithContext(1, data.mainContext, data.parent, data.rootContext);
                assertExpectedValue(booleanValue, data.mainContext.booleanProp);
                let stringValue = propStr.getValueWithContext(2, data.mainContext, data.parent, data.rootContext);
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
        element.setAttribute('data-value', "13");
        element.setAttribute('data-method-value', "${getMethodValue}");
        element.innerHTML = "Description: ${description}";
        let boundContext = {
            index: 3
        };
        return {
            element: element,
            context: {
                classes: "alert-warning",
                isHidden: true,
                displayChild: false,
                numValue: 5,
                getIsHidden(dataBoundContext) {
                    return boundContext.index == 4;
                },
                getDataBoundHidden(dataBoundContext) {
                    return dataBoundContext.element.getAttribute("data-sub-value") == "12";
                },
                getMethodValue(dataBoundContext) {
                    return dataBoundContext.element.getAttribute("data-value");
                },
                raiseClick() {
                    element.setAttribute('class', "alert-info");
                },
                raiseClick2(event, dataBoundContext) {
                    element.setAttribute('data-bound-index', dataBoundContext.index.toString());
                },
                raiseClick3(event, dataBoundContext) {
                    dataBoundContext.element.setAttribute("data-clicked", "true");
                },
                description: "Basic element binding example."
            },
            dataBoundContext: boundContext
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
                assertExpectedValue(data.element.attributes.class.nodeValue, "alert-info");
                assert(!data.element.attributes.onclick, "Expected 'onclick' attribute to have been removed.");
                assertExpectedValue(data.element.getAttribute('data-bound-method-onclick'), "Object.raiseClick");
            }
        },
        {
            name: "Method Binding Accessing Context",
            method(data) {
                data.element.setAttribute('onclick', '${raiseClick2}');
                let methodBinding = new DataBoundMethodAttribute(data.element.attributes.onclick);
                methodBinding.renderWithContext(data.context, data.dataBoundContext);
                data.element.click();
                assertExpectedValue(data.element.attributes['data-bound-index'].nodeValue, "3");
            }
        },
        {
            name: "Data Bound Element",
            method(data) {
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);

                assertExpectedValue(data.element.attributes.class.nodeValue, data.context.classes);
                assert(data.element.attributes.hidden && data.element.attributes.hidden.nodeValue == "",
                    "Expected hidden attribute to exist with an empty string as its value.");
                data.element.click();
                assertExpectedValue(data.element.attributes.class.nodeValue, "alert-info");
            }
        },
        {
            name: "Method Binding Accessing Bound Element",
            method(data) {
                data.element.setAttribute('onclick', '${raiseClick3}');
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context, data.dataBoundContext);
                data.element.click();
                assertExpectedValue(data.element.getAttribute("data-clicked"), "true");
            }
        },
        {
            name: "Access Element With Method Prop",
            method(data) {
                let attrBinding = new DataBoundElement(data.element);
                attrBinding.renderWithContext(data.context);
                assertExpectedValue(
                    data.element.getAttribute("data-method-value"),
                    data.element.getAttribute("data-value"));
            }
        },
        {
            name: "Data Bound Element with Sub-Element",
            method(data) {
                let subElement = document.createElement('div');
                subElement.setAttribute("class", "${subClass}");
                subElement.innerHTML = "${subElementDesc}";
                data.context.subElementDesc = "This is a sub-element.";
                data.context.subClass = "my-sub-class";
                data.element.appendChild(subElement);

                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);

                assertExpectedValue(subElement.attributes.class.nodeValue, data.context.subClass);
                assertExpectedValue(subElement.innerHTML, data.context.subElementDesc);
            }
        },
        {
            name: "Data Bound If",
            method(data) {
                let subElement = document.createElement('div');
                subElement.setAttribute("data-bound-if", "${displayChild}");
                data.element.appendChild(subElement);

                let boundIf = new DataBoundIfNode(subElement);
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.context.displayChild = true;
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Data Bound If With Method",
            method(data) {
                let subElement = document.createElement('div');
                subElement.setAttribute("data-bound-if", "${getIsHidden}");
                data.element.appendChild(subElement);

                let boundIf = new DataBoundIfNode(subElement);
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.dataBoundContext.index = 4;
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Data Bound If Through Bound Element",
            method(data) {
                let subElement = document.createElement('div');
                subElement.setAttribute("data-bound-if", "${displayChild}");
                data.element.appendChild(subElement);

                let boundIf = new DataBoundElement(data.element);
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.context.displayChild = true;
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Data Bound If With Method Accessing Data Bound Context",
            method(data) {
                let subElement = document.createElement('div');
                subElement.setAttribute("data-bound-if", "${getDataBoundHidden}");
                subElement.setAttribute("data-sub-value", "11");
                data.element.appendChild(subElement);

                let boundIf = new DataBoundElement(data.element);
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                subElement.setAttribute("data-sub-value", "12");
                boundIf.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        }
    ]
});

TestSuites.suites.push({
    name: "Boolean Attribute Conditionals",
    getData() {
        let element = document.createElement('div');
        element.setAttribute('hidden', '${isHidden}');
        element.setAttribute('disabled', '${numValue}');
        element.setAttribute('checked', '${checkedValue}');
        element.setAttribute('data-bound-checked-eq', '${checkedCondition}');
        return {
            element: element,
            context: {
                checkedValue: "checked",
                checkedCondition: "checked",
                isHidden: true,
                numValue: 5,
            }
        }
    },
    tests: [
        {
            name: "Equals",
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
        },
        {
            name: "Not Equals",
            method(data) {
                data.element.setAttribute('data-bound-disabled-neq', '5');
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.disabled, "Expected 'disabled' attribute to be removed.");

                data.element.setAttribute('data-bound-disabled-neq', '4');
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.disabled && data.element.attributes.disabled.nodeValue == "",
                    "Expected 'disabled' attribute to exists with empty string as its value.");
            }
        },
        {
            name: "Less Than",
            method(data) {
                data.element.setAttribute('data-bound-disabled-lt', '5');
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.disabled, "Expected 'disabled' attribute to be removed.");

                data.element.setAttribute('data-bound-disabled-lt', '6');
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.disabled && data.element.attributes.disabled.nodeValue == "",
                    "Expected 'disabled' attribute to exists with empty string as its value.");
            }
        },
        {
            name: "Less Than Or Equal",
            method(data) {
                data.element.setAttribute('data-bound-disabled-lte', '4');
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.disabled, "Expected 'disabled' attribute to be removed.");

                data.element.setAttribute('data-bound-disabled-lte', '5');
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.disabled && data.element.attributes.disabled.nodeValue == "",
                    "Expected 'disabled' attribute to exists with empty string as its value.");
            }
        },
        {
            name: "Greater Than",
            method(data) {
                data.element.setAttribute('data-bound-disabled-gt', '5');
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.disabled, "Expected 'disabled' attribute to be removed.");

                data.element.setAttribute('data-bound-disabled-gt', '4');
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.disabled && data.element.attributes.disabled.nodeValue == "",
                    "Expected 'disabled' attribute to exists with empty string as its value.");
            }
        },
        {
            name: "Greater Than Or Equal",
            method(data) {
                data.element.setAttribute('data-bound-disabled-gte', '6');
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.disabled, "Expected 'disabled' attribute to be removed.");

                data.element.setAttribute('data-bound-disabled-gte', '5');
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.disabled && data.element.attributes.disabled.nodeValue == "",
                    "Expected 'disabled' attribute to exists with empty string as its value.");
            }
        },
        {
            name: "Not",
            method(data) {
                data.element.setAttribute('data-bound-hidden-not', '');
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.hidden);
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.hidden, "Expected 'hidden' attribute to be removed.");

                data.context.isHidden = false;
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.hidden && data.element.attributes.hidden.nodeValue == "",
                    "Expected 'hidden' attribute to exists with empty string as its value.");
            }
        },
        {
            name: "Conditional Bindings",
            method(data) {
                let booleanBinding = new DataBoundBooleanAttribute(data.element.attributes.checked);
                booleanBinding.renderWithContext(data.context);
                assert(data.element.attributes.checked && data.element.attributes.checked.nodeValue == "",
                    "Expected 'checked' attribute to exists with empty string as its value.");

                data.context.checkedCondition = "not checked";
                booleanBinding.renderWithContext(data.context);
                assert(!data.element.attributes.checked, "Expected 'checked' attribute to be removed.");
            }
        }
    ]
});

TestSuites.suites.push({
    name: "Data Bound If Conditions",
    getData() {
        let element = document.createElement('div');
        let childElement = document.createElement('div');
        childElement.setAttribute('data-bound-if', '${checkedValue}');
        element.appendChild(childElement);
        return {
            element: element,
            childElement: childElement,
            context: {
                checkedValue: 5,
                conditionValue: 4
            }
        }
    },
    tests: [
        {
            name: "Equals",
            method(data) {
                data.childElement.setAttribute("data-bound-if-eq", "4");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.childElement.setAttribute("data-bound-if-eq", "5");
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Not Equals",
            method(data) {
                data.childElement.setAttribute("data-bound-if-neq", "5");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.childElement.setAttribute("data-bound-if-neq", "4");
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Less Than",
            method(data) {
                data.childElement.setAttribute("data-bound-if-lt", "5");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.childElement.setAttribute("data-bound-if-lt", "6");
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Less Than Or Equals",
            method(data) {
                data.childElement.setAttribute("data-bound-if-lte", "4");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.childElement.setAttribute("data-bound-if-lte", "5");
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Greater Than",
            method(data) {
                data.childElement.setAttribute("data-bound-if-gt", "5");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.childElement.setAttribute("data-bound-if-gt", "4");
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Greater Than Or Equal",
            method(data) {
                data.childElement.setAttribute("data-bound-if-gte", "56");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.childElement.setAttribute("data-bound-if-gte", "5");
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Not",
            method(data) {
                data.childElement.setAttribute("data-bound-if-not", "");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.context.checkedValue = false;
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        },
        {
            name: "Conditional Binding",
            method(data) {
                data.childElement.setAttribute("data-bound-if-eq", "${conditionValue}");
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 0);

                data.context.conditionValue = 5;
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.element.childElementCount, 1);
            }
        }
    ]
});

TestSuites.suites.push({
    name: "Bound Element Arrays",
    getData() {
        let baseElement = document.createElement("ul");
        let childElement = document.createElement("li");
        childElement.setAttribute("data-bound-array", "${items}");
        childElement.innerHTML = "${.dataBoundIndex}: ${text}";
        baseElement.appendChild(childElement);
        return {
            element: baseElement,
            childElement: childElement,
            context: {
                itemClass: "item-class",
                items: [
                    {text: "Item 1"},
                    {text: "Item 2"},
                    {text: "Item 3"},
                    {text: "Item 4"}
                ]
            },
            dataBoundContext: {
                itemValue: "Parent Bound Context"
            }
        }
    },
    tests: [
        {
            name: "Creation",
            method(data) {
                let elementArray = new DataBoundElementArray(data.childElement);
                let baseChild = data.element.childNodes[0];
                assert(baseChild != data.childElement, "Child element should've been replaced.");
            }
        },
        {
            name: "Child Count After Render",
            method(data) {
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context);
                assertExpectedValue(data.element.childNodes.length, data.context.items.length + 1,
                    "Expecting child nodes to be equal to number of items plus 1 (for anchor element).");
            }
        },
        {
            name: "Item Render Values",
            method(data) {
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context);
                for (let i=0; i<data.context.items.length; i++) {
                    let childNode = data.element.childNodes[i];
                    let childContext = data.context.items[i];
                    assertExpectedValue(childNode.innerHTML, i + ": " + childContext.text);
                }
            }
        },
        {
            name: "Item Reference Parent Context",
            method(data) {
                data.childElement.setAttribute("class", "${.arrayContext.itemClass}");
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context);
                for (let i=0; i<data.context.items.length; i++) {
                    let childNode = data.element.childNodes[i];
                    assertExpectedValue(childNode.attributes.class.nodeValue, data.context.itemClass);
                }
            }
        },
        {
            name: "Reference Item Value Directly",
            method(data) {
                data.context.items = ["Item 1", "Item 2", "Item 3", "Item 4"];
                data.childElement.innerHTML = "${.contextValue}";
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context);
                for (let i=0; i<data.context.items.length; i++) {
                    let childNode = data.element.childNodes[i];
                    assertExpectedValue(childNode.innerHTML, data.context.items[i]);
                }
            }
        },
        {
            name: "Reference Parent Data Bound Context",
            method(data) {
                data.childElement.innerHTML = "${.dataBoundIndex}: ${.parent.itemValue}";
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context, data.dataBoundContext);
                for (let i=0; i<data.context.items.length; i++) {
                    let childNode = data.element.childNodes[i];
                    assertExpectedValue(childNode.innerHTML, i + ": " + data.dataBoundContext.itemValue);
                }
            }
        },
        {
            name: "Count After Adding Items",
            method(data) {
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context, data.dataBoundContext);

                data.context.items.push({text: "Item 5"});
                data.context.items.push({text: "Item 6"});
                data.context.items.push({text: "Item 7"});
                elementArray.renderWithContext(data.context, data.dataBoundContext);

                assertExpectedValue(data.element.childNodes.length, data.context.items.length + 1,
                    "Expecting child nodes to be equal to number of items plus 1 (for anchor element).");
            }
        },
        {
            name: "Count After Removing Items",
            method(data) {
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context, data.dataBoundContext);

                data.context.items.pop();
                data.context.items.pop();
                elementArray.renderWithContext(data.context, data.dataBoundContext);

                assertExpectedValue(data.element.childNodes.length, data.context.items.length + 1,
                    "Expecting child nodes to be equal to number of items plus 1 (for anchor element).");
            }
        },
        {
            name: "Order After Removing Items",
            method(data) {
                let elementArray = new DataBoundElementArray(data.childElement);
                elementArray.renderWithContext(data.context, data.dataBoundContext);

                data.context.items.splice(1, 2);
                elementArray.renderWithContext(data.context, data.dataBoundContext);

                assertExpectedValue(data.element.childNodes[0].innerHTML, "0: Item 1");
                assertExpectedValue(data.element.childNodes[1].innerHTML, "1: Item 4");
            }
        },
        {
            name: "Child Count After Creation As Child",
            method(data) {
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context, data.dataBoundContext);

                assertExpectedValue(data.element.childNodes.length, data.context.items.length + 1,
                    "Expecting child nodes to be equal to number of items plus 1 (for anchor element).");
            }
        }
    ]
});

TestSuites.suites.push({
    name: "References",
    getData() {
        let element = document.createElement("div");

        let refChild = document.createElement("div");
        refChild.setAttribute("data-bound-ref", "child1");

        element.appendChild(refChild);

        let testContext = {
            childRefFound: null
        };

        return {
            element: element,
            refChild: refChild,
            context: {
                childReference: "contextChildReference",
                childRefMethod(ref) {
                    testContext.childRefFound = ref;
                }
            },
            testContext: testContext
        }
    },
    tests: [
        {
            name: "Simple Reference",
            method(data) {
                let boundElement = new DataBoundElement(data.element);
                assert(boundElement.refs.child1.domElement === data.refChild,
                    "Expecting reference on bound element to exactly equal refChild.");
            }
        },
        {
            name: "Implicit Reference With ID",
            method(data) {
                data.refChild.setAttribute("data-bound-ref", "");
                data.refChild.setAttribute("id", "child1");
                let boundElement = new DataBoundElement(data.element);
                assert(boundElement.refs.child1.domElement === data.refChild,
                    "Expecting reference on bound element to exactly equal refChild.");
            }
        }
    ]
});

TestSuites.suites.push({
    name: "Ignores",
    getData() {
        let element = document.createElement("div");

        let ignoreChild = document.createElement("div");
        ignoreChild.setAttribute("data-bound-ignore", "");
        ignoreChild.innerHTML = "${childText}";

        element.appendChild(ignoreChild);

        return {
            element: element,
            child: ignoreChild,
            context: {
                childText: "This text shouldn't appear."
            }
        }
    },
    tests: [
        {
            name: "Simple Ignore",
            method(data) {
                let boundElement = new DataBoundElement(data.element);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.child.innerHTML, "${childText}");
            }
        }
    ]
});

TestSuites.suites.push({
    name: "Sub Contexts",
    getData() {
        let rootElement = document.createElement("div");
        let child = document.createElement("h4");
        child.innerHTML = "${title}";
        rootElement.appendChild(child);

        let subContext = document.createElement("section");
        subContext.setAttribute("data-bound-context", "");
        subContext.setAttribute("id", "mySubContext");
        let subChild = document.createElement("span");
        subChild.innerHTML = "${description} of the ${~title} page";
        subContext.appendChild(subChild);

        rootElement.appendChild(subContext);

        return {
            rootElement: rootElement,
            rootChild: child,
            subContextElement: subContext,
            subContextChild: subChild,
            context: {
                title: "My Title",
                subContext: {
                    description: "Page Description"
                }
            }
        }
    },
    tests: [
        {
            name: "Sub Context Creation",
            method(data) {
                let boundElement = new DataBoundElement(data.rootElement);
                assert(boundElement.subContexts.mySubContext, "Expected sub-context with name 'mySubContext' to exist.");
            }
        },
        {
            name: "Root Render",
            method(data) {
                let boundElement = new DataBoundElement(data.rootElement);
                boundElement.renderWithContext(data.context);
                assertExpectedValue(data.subContextChild.innerHTML, "${description} of the ${~title} page");
            }
        },
        {
            name: "Sub Context Render",
            method(data) {
                let boundElement = new DataBoundElement(data.rootElement);
                boundElement.renderWithContext(data.context);
                let sub = boundElement.subContexts.mySubContext;
                sub.renderWithContext(data.context.subContext);
                assertExpectedValue(data.subContextChild.innerHTML,
                    data.context.subContext.description + " of the " + data.context.title + " page");
            }
        },
        {
            name: "Sub Context Render After Root Context Changed",
            method(data) {
                let boundElement = new DataBoundElement(data.rootElement);
                boundElement.renderWithContext(data.context);
                let sub = boundElement.subContexts.mySubContext;
                sub.renderWithContext(data.context.subContext);

                data.context.title = "My New Title";
                sub.renderWithContext(data.context.subContext);

                assertExpectedValue(data.subContextChild.innerHTML,
                    data.context.subContext.description + " of the " + data.context.title + " page");
            }
        }
    ]
});