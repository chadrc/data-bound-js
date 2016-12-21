/**
 * Created by chad on 12/16/16.
 */

describe('Prop Parsing', function () {

  let tests = [
    {
      propStr: "${myProp}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "myProp", expectedMatch: "${myProp}",
          expectedRootRef: false, expectedBoundRef: false
        }]
    },
    {
      propStr: "    ${myProp}    ", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "myProp", expectedMatch: "${myProp}",
          expectedRootRef: false, expectedBoundRef: false,
        }]
    },
    {
      propStr: "${    myProp    }", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "myProp", expectedMatch: "${    myProp    }",
          expectedRootRef: false, expectedBoundRef: false
        }]
    },
    {
      propStr: "${seci@lCh@r@cters}", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "${no spaces}", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "notAProp", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "not props ${aProp}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "aProp", expectedMatch: "${aProp}",
          expectedRootRef: false, expectedBoundRef: false
        }]
    },
    {
      propStr: "${firstProp} some middle text ${secondProp}", expectedLength: 2,
      expectedValues: [
        {
          expectedProp: "firstProp", expectedMatch: "${firstProp}",
          expectedRootRef: false, expectedBoundRef: false
        },
        {
          expectedProp: "secondProp", expectedMatch: "${secondProp}",
          expectedRootRef: false, expectedBoundRef: false
        }
      ]
    },
    {
      propStr: "${firstProp ${secondProp}}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "secondProp", expectedMatch: "${secondProp}",
          expectedRootRef: false, expectedBoundRef: false
        }]
    },
    {
      propStr: "${firstProp ${secondProp}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "secondProp", expectedMatch: "${secondProp}",
          expectedRootRef: false, expectedBoundRef: false
        }]
    },
    {
      propStr: "${~rootProp}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "rootProp", expectedMatch: "${~rootProp}",
          expectedRootRef: true, expectedBoundRef: false
        }]
    },
    {
      propStr: "${root~Prop}", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "${rootProp~}", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "${.myProp}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "myProp", expectedMatch: "${.myProp}",
          expectedRootRef: false, expectedBoundRef: true
        }]
    },
    {
      propStr: "${myProp.}", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "${~.myProp}", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "${.~myProp}", expectedLength: 0,
      expectedValues: []
    },
    {
      propStr: "${myProp.subProp}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "myProp.subProp", expectedMatch: "${myProp.subProp}",
          expectedRootRef: false, expectedBoundRef: false
        }]
    },
    {
      propStr: "${.myProp.subProp}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "myProp.subProp", expectedMatch: "${.myProp.subProp}",
          expectedRootRef: false, expectedBoundRef: true
        }]
    },
    {
      propStr: "${0}", expectedLength: 1,
      expectedValues: [
        {
          expectedProp: "0", expectedMatch: "${0}",
          expectedRootRef: false, expectedBoundRef: false
        }
      ]
    }
  ];

  tests.forEach(function (test) {
    describe("'" + test.propStr + "'", function () {
      let result = DataBoundUtils.extractPropsFromString(test.propStr);

      it('result should have ' + test.expectedLength + ' prop' + (test.expectedLength == 1 ? "" : "s"),
        function () {
          expect(result).to.have.length(test.expectedLength);
        });

      for (let i = 0; i < result.length; i++) {
        let value = result[i];
        let expectedValue = test.expectedValues[i];
        it('prop ' + (i + 1) + ' should have field "prop" with "' + expectedValue.expectedProp + '" as value',
          function () {
            expect(value.prop).to.deep.equal(expectedValue.expectedProp);
          });

        it('prop ' + (i + 1) + ' should have field "match" with "' + expectedValue.expectedMatch + '" as value',
          function () {
            expect(value.match).to.deep.equal(expectedValue.expectedMatch);
          });

        if (expectedValue.expectedBoundRef) {
          it('prop ' + (i + 1) + ' should have data bound reference', function () {
            expect(value.selfRef).to.be.true;
          })
        }

        if (expectedValue.expectedRootRef) {
          it('prop ' + (i + 1) + ' should have root reference', function () {
            expect(value.rootRef).to.be.true;
          })
        }
      }
    });
  });
});