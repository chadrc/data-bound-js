
TestSuites.Utils = {
    extractPropsFromString: function test_extractPropsFromString() {
        const propsToTest = [
            {prop: "${myProp}", expected: {expectedProp: "myProp", expectedMatch: "${myProp}"}}, // 0
            {prop: "  ${myProp}  ", expected: {expectedProp: "myProp", expectedMatch: "${myProp}"}}, // 1
            {prop: "${  myProp  }", expected: {expectedProp: "myProp", expectedMatch: "${  myProp  }"}}, // 2
            {prop: "${~rootProp}", expected: {expectedProp: "~rootProp", expectedMatch: "${~rootProp}"}}, // 3
            {prop: "${root~Prop}", expected: null}, // 4
            {prop: "${rootProp~}", expected: null}, // 5
            {prop: "${myProp.subProp}", expected: {expectedProp: "myProp.subProp", expectedMatch: "${myProp.subProp}"}}, // 6
            {prop: "${.myProp.subProp}", expected: {expectedProp: ".myProp.subProp", expectedMatch: "${.myProp.subProp}"}}, // 7
            {prop: "${myProp.}", expected: null}, // 8
            {prop: "${~.myProp}", expected: {expectedProp: "~.myProp", expectedMatch: "${~.myProp}"}}, // 9
            {prop: "${.~myProp}", expected: null}, // 10
            {prop: "not props ${aProp}", expected: {expectedProp: "aProp", expectedMatch: "${aProp}"}}, // 11
            {prop: "${no spaces}", expected: null}, // 12
            {prop: "${seci@lCh@r@cters}", expected: null} // 13
        ];

        for (let i = 0; i < propsToTest.length; i++) {
            let pair = propsToTest[i];
            let dbProp = DataBoundUtils.extractPropsFromString(pair.prop);
            if (pair.expected == null) {
                assert(dbProp == null, i + ": Expecting no match, got ", dbProp);
            } else {
                dbProp = dbProp[0];
                assert(dbProp.prop == pair.expected.expectedProp, i + ": Extracted prop should be '" + pair.expected.expectedProp + "', got '" + dbProp.prop + "'");
                assert(dbProp.match == pair.expected.expectedMatch, i + ": Extracted match should be '" + pair.expected.expectedMatch + "', got '" + dbProp.match + "'");
            }
        }
    }
};
