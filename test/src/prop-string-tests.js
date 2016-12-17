/**
 * Created by chad on 12/17/16.
 */

describe("Prop Strings", function () {
  let context = {
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

  let dataBoundContext = {
    myProp: "My Bound Context"
  };

  let rootContext = {
    myProp: "Root Context"
  };

  let tests = [
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
        let propString = new DataBoundPropString(test.str);
        let render = propString.renderWithContext(context, dataBoundContext, rootContext);
        expect(render).to.deep.equal(test.expected);
      })
    })
  });

  describe("Null Context", function () {
    it('should been undefined', function () {
      let propString = new DataBoundPropString("${nullProp}");
      let render = propString.renderWithContext(null, null, null);
      expect(render).to.deep.equal("undefined");
    })
  });

  describe("'${numberProp} ${booleanProp} ${myProp}'", function () {
    let propString = new DataBoundPropString("${numberProp} ${booleanProp} ${myProp}");
    it("first value should equal '" + context.numberProp + "'", function () {
      let numberVal = propString.getValueWithContext(0, context, dataBoundContext, rootContext);
      expect(numberVal).to.deep.equal(context.numberProp);
    });

    it("second value should equal '" + context.booleanProp + "'", function () {
      let booleanVal = propString.getValueWithContext(1, context, dataBoundContext, rootContext);
      expect(booleanVal).to.deep.equal(context.booleanProp);
    });

    it("third value should equal '" + context.myProp + "'", function () {
      let stringVal = propString.getValueWithContext(2, context, dataBoundContext, rootContext);
      expect(stringVal).to.deep.equal(context.myProp);
    });
  })
});