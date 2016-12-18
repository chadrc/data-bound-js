/**
 * Created by chad on 12/17/16.
 */

describe("Boolean Attribute Conditionals", function () {
  let setup = function () {
    let element = document.createElement('div');
    element.setAttribute('disabled', '${value}');
    let context = {
      value: 5
    };
    return {
      element: element,
      context: context
    };
  };

  let tests = [
    {name: "Equals", attr: 'data-bound-disabled-eq', falseVal: '4', trueVal: '5'},
    {name: "Not Equals", attr: 'data-bound-disabled-neq', falseVal: '5', trueVal: '4'},
    {name: "Less Than", attr: 'data-bound-disabled-lt', falseVal: '4', trueVal: '6'},
    {name: "Less Than Or Equal", attr: 'data-bound-disabled-lte', falseVal: '4', trueVal: '5'},
    {name: "Greater Than", attr: 'data-bound-disabled-gt', falseVal: '6', trueVal: '4'},
    {name: "Greater Than Or Equal", attr: 'data-bound-disabled-gte', falseVal: '6', trueVal: '5'}
  ];

  tests.forEach(function (test) {
    describe(test.name, function () {
      let data = setup();
      data.element.setAttribute(test.attr, '');
      let binding = new DataBoundBooleanAttribute(data.element.attributes.disabled);

      it(`disabled attribute should not exist when condition value is '${test.falseVal}'`, function () {
        data.element.setAttribute(test.attr, test.falseVal);
        binding.renderWithContext(data.context);
        expect(data.element.attributes.disabled).to.not.exist;
      });

      it(`disabled attribute should exist when condition value is '${test.trueVal}'`, function () {
        data.element.setAttribute(test.attr, test.trueVal);
        binding.renderWithContext(data.context);
        expect(data.element.attributes.disabled).to.exist;
      });
    });
  });

  describe("Not", function () {
    let data = setup();
    data.element.setAttribute("data-bound-disabled-not", "");
    let binding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
    binding.renderWithContext(data.context);

    it(`disabled attribute should not exist when condition value exists`, function () {
      expect(data.element.attributes.disabled).to.not.exist;
    });

    it(`disabled attribute should exist when condition value does not exist`, function () {
      data.context.value = null;
      binding.renderWithContext(data.context);
      expect(data.element.attributes.disabled).to.exist;
    });
  });

  describe("Binding", function () {
    let data = setup();
    data.context.bindVal = 4;
    data.element.setAttribute("data-bound-disabled-eq", "${bindVal}");
    let binding = new DataBoundBooleanAttribute(data.element.attributes.disabled);
    binding.renderWithContext(data.context);

    it(`disabled attribute should not exist when bound value does not equal value`, function () {
      expect(data.element.attributes.disabled).to.not.exist;
    });

    it(`disabled attribute should exist when bound value equals value`, function () {
      data.context.bindVal = 5;
      binding.renderWithContext(data.context);
      expect(data.element.attributes.disabled).to.exist;
    });
  })
});