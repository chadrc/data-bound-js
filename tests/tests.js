
TestSuites.Utils = {
    extractPropFromString: function test_extractPropFromString() {
        const propsToTest = [
            {prop: "${myProp}", expected: "myProp"},
            {prop: "  ${myProp}  ", expected: "myProp"},
            {prop: "${  myProp  }", expected: "myProp"},

        ];

        for (let i = 0; i < propsToTest.length; i++) {
            let pair = propsToTest[i];
            let dbProp = DataBoundUtils.extractPropFromString(pair.prop);
            assert(dbProp == pair.expected, i + ": Extracted prop should be '" + pair.expected + "', got '" + dbProp + "'");
        }
    }
};
