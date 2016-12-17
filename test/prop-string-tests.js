/**
 * Created by chad on 12/17/16.
 */

describe("Prop Strings", function () {
  var context = {
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
    dataBoundMethodProp(bdc) {
      return bdc ? bdc.myProp : undefined;
    },
    get getProp() {
      return "Gotten Prop";
    }
  };

  var dataBoundContext = {
    myProp: "My Bound Context"
  };

  var rootContext = {
    myProp: "Root Context"
  };

  var tests = [
    {str: "${myProp}", expected: context.myProp},
    {str: "${myProp} is ${helloProp}", expected: (context.myProp + " is " + context.helloProp)},
    {str: "${.myProp}", expected: dataBoundContext.myProp},
    {str: "${~myProp}", expected: rootContext.myProp},
    {str: "${methodProp}", expected: context.methodProp()},
    {str: "${dataBoundMethodProp}", expected: dataBoundContext.myProp},
    {str: "${getProp}", expected: context.getProp},
    {str: "${myProp} ${myProp}", expected: (context.myProp + " " + context.myProp)},
    {str: "${parentProp.nestedProp}", expected: context.parentProp.nestedProp},
    {str: "${undefinedProp}", expected: "undefined"},
    {str: "${undefinedProp.nonexistentProp}", expected: "undefined"},
    {str: "${nullProp}", expected: "null"},
    {str: "${nullProp.nonexistentProp}", expected: "undefined"}
  ];

  tests.forEach(function (test) {
    describe("'" + test.str + "'", function () {
      it('should have value "' + test.expected + '"', function () {
        var propString = new DataBoundPropString(test.str);
        var render = propString.renderWithContext(context, dataBoundContext, rootContext);
        expect(render).to.deep.equal(test.expected);
      })
    })
  });

  describe("Null Context", function () {
    it('should been undefined', function () {
      var propString = new DataBoundPropString("${nullProp}");
      var render = propString.renderWithContext(null, null, null);
      expect(render).to.deep.equal("undefined");
    })
  });

  describe("'${numberProp} ${booleanProp} ${myProp}'", function () {
    var propString = new DataBoundPropString("${numberProp} ${booleanProp} ${myProp}");
    it("first value should equal '" + context.numberProp + "'", function () {
      var numberVal = propString.getValueWithContext(0, context, dataBoundContext, rootContext);
      expect(numberVal).to.deep.equal(context.numberProp);
    });

    it("second value should equal '" + context.booleanProp + "'", function () {
      var booleanVal = propString.getValueWithContext(1, context, dataBoundContext, rootContext);
      expect(booleanVal).to.deep.equal(context.booleanProp);
    });

    it("third value should equal '" + context.myProp + "'", function () {
      var stringVal = propString.getValueWithContext(2, context, dataBoundContext, rootContext);
      expect(stringVal).to.deep.equal(context.myProp);
    });
  })
});