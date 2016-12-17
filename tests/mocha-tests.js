/**
 * Created by chad on 12/16/16.
 */

describe('Prop Parsing', function () {

    var tests = [
      {
        propStr: "${myProp}", expectedLength: 1,
        expectedValues: [{expectedProp: "myProp", expectedMatch: "${myProp}"}]
      },
      {
        propStr: "    ${myProp}    ", expectedLength: 1,
        expectedValues: [{expectedProp: "myProp", expectedMatch: "${myProp}"}]
      },
      {
        propStr: "${    myProp    }", expectedLength: 1,
        expectedValues: [{expectedProp: "myProp", expectedMatch: "${    myProp    }"}]
      },
      {
        propStr: "${seci@lCh@r@cters}", expectedLength: 0, expectedValues: []
      },
      {
        propStr: "${no spaces}", expectedLength: 0, expectedValues: []
      },
    ];

    tests.forEach(function (test) {
      describe("'" + test.propStr + "'", function () {
      var result = DataBoundUtils.extractPropsFromString(test.propStr);

      it('result should have ' + test.expectedLength + ' value' + (test.expectedLength == 1 ? "" : "s"), function () {
        expect(result).to.have.length(test.expectedLength);
      });

      for (var i = 0; i < result.length; i++) {
        var value = result[i];
        var expectedValue = test.expectedValues[i];
        it('value ' + (i+1) + ' should have field "prop" with "' + expectedValue.expectedProp + '" as value', function () {
          expect(value.prop).to.deep.equal(expectedValue.expectedProp);
        });

        it('value ' + (i+1)  + ' should have field "match" with "' + expectedValue.expectedMatch + '" as value', function () {
          expect(value.match).to.deep.equal(expectedValue.expectedMatch);
        });
      }
    });
  });
});