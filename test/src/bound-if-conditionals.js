/**
 * Created by chad on 12/17/16.
 */

describe("Bound If Attribute Conditionals", function () {
  let setup = function () {
    let element = document.createElement('div');
    let subElement = document.createElement('div');
    subElement.setAttribute('data-bound-if', '${value}');
    element.appendChild(subElement);
    let context = {
      value: 5
    };
    return {
      element: element,
      subElement: subElement,
      context: context
    };
  };

  let tests = [
    {name: "Equals", attr: 'data-bound-if-eq', falseVal: '4', trueVal: '5'},
    {name: "Not Equals", attr: 'data-bound-if-neq', falseVal: '5', trueVal: '4'},
    {name: "Less Than", attr: 'data-bound-if-lt', falseVal: '4', trueVal: '6'},
    {name: "Less Than Or Equal", attr: 'data-bound-if-lte', falseVal: '4', trueVal: '5'},
    {name: "Greater Than", attr: 'data-bound-if-gt', falseVal: '6', trueVal: '4'},
    {name: "Greater Than Or Equal", attr: 'data-bound-if-gte', falseVal: '6', trueVal: '5'}
  ];

  tests.forEach(function (test) {
    describe(test.name, function () {
      let data = setup();
      data.subElement.setAttribute(test.attr, '');
      let binding = new DataBoundElement(data.element);

      it(`child count should be 0 when condition value is '${test.falseVal}'`, function () {
        data.subElement.setAttribute(test.attr, test.falseVal);
        binding.renderWithContext(data.context);
        expect(data.element.childElementCount).to.deep.equal(0);
      });

      it(`child count should be 1 when condition value is '${test.trueVal}'`, function () {
        data.subElement.setAttribute(test.attr, test.trueVal);
        binding.renderWithContext(data.context);
        expect(data.element.childElementCount).to.deep.equal(1);
      });
    });
  });

  describe("Not", function () {
    let data = setup();
    data.subElement.setAttribute("data-bound-if-not", "");
    let binding = new DataBoundElement(data.element);
    binding.renderWithContext(data.context);

    it(`child count should be 0 when condition value exists`, function () {
      expect(data.element.childElementCount).to.deep.equal(0);
    });

    it(`child count should be 1 when condition value does not exist`, function () {
      data.context.value = null;
      binding.renderWithContext(data.context);
      expect(data.element.childElementCount).to.deep.equal(1);
    });
  });

  describe("Binding", function () {
    let data = setup();
    data.context.bindVal = 4;
    data.subElement.setAttribute("data-bound-if-eq", "${bindVal}");
    let binding = new DataBoundElement(data.element);
    binding.renderWithContext(data.context);

    it(`child count should be 0 when bound value does not equal value`, function () {
      expect(data.element.childElementCount).to.deep.equal(0);
    });

    it(`child count should be 1 bound value equals value`, function () {
      data.context.bindVal = 5;
      binding.renderWithContext(data.context);
      expect(data.element.childElementCount).to.deep.equal(1);
    });
  })
});