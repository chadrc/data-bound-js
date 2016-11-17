
TestSuites.Utils = {
    extractPropFromString: function test_extractPropFromString() {
        const propsToTest = [
            {prop: "${myProp}", expected: "myProp"}, // 0
            {prop: "  ${myProp}  ", expected: "myProp"}, // 1
            {prop: "${  myProp  }", expected: "myProp"}, // 2
            {prop: "${~rootProp}", expected: "~rootProp"}, // 3
            {prop: "${root~Prop}", expected: ""}, // 4
            {prop: "${rootProp~}", expected: ""}, // 5
            {prop: "${myProp.subProp}", expected: "myProp.subProp"}, // 6
            {prop: "${.myProp.subProp}", expected: ".myProp.subProp"}, // 7
            {prop: "${myProp.}", expected: ""}, // 8
            {prop: "${~.myProp}", expected: "~.myProp"}, // 9
            {prop: "${.~myProp}", expected: ""}, // 10
            {prop: "not props ${aProp}", expected: "aProp"},
            {prop: "${no spaces}", expected: ""},
            {prop: "${seci@lCh@r@cters", expected: ""}
        ];

        for (let i = 0; i < propsToTest.length; i++) {
            let pair = propsToTest[i];
            let dbProp = DataBoundUtils.extractPropFromString(pair.prop);
            assert(dbProp == pair.expected, i + ": Extracted prop should be '" + pair.expected + "', got '" + dbProp + "'");
        }
    }
};
