
TestSuites.Utils = {
    extractSingleProp: () => {
        const cases = [
            {prop: "${myProp}",
                expected: {expectedProp: "myProp", expectedMatch: "${myProp}"}}, // 0
            {prop: "  ${myProp}  ",
                expected: {expectedProp: "myProp", expectedMatch: "${myProp}"}}, // 1
            {prop: "${  myProp  }",
                expected: {expectedProp: "myProp", expectedMatch: "${  myProp  }"}}, // 2
            {prop: "${~rootProp}",
                expected: {expectedProp: "~rootProp", expectedMatch: "${~rootProp}"}}, // 3
            {prop: "${root~Prop}", expected: null}, // 4
            {prop: "${rootProp~}", expected: null}, // 5
            {prop: "${myProp.subProp}",
                expected: {expectedProp: "myProp.subProp", expectedMatch: "${myProp.subProp}"}}, // 6
            {prop: "${.myProp.subProp}",
                expected: {expectedProp: ".myProp.subProp", expectedMatch: "${.myProp.subProp}"}}, // 7
            {prop: "${myProp.}", expected: null}, // 8
            {prop: "${~.myProp}",
                expected: {expectedProp: "~.myProp", expectedMatch: "${~.myProp}"}}, // 9
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
                assert(props.prop == pair.expected.expectedProp, i + ": Extracted prop should be '" +
                    pair.expected.expectedProp + "', got '" + props.prop + "'");
                assert(props.match == pair.expected.expectedMatch, i + ": Extracted match should be '" +
                    pair.expected.expectedMatch + "', got '" + props.match + "'");
            }
        }
    },
    extractMultipleProps: () => {
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
    }
};
