/**
 * Created by chad on 12/17/16.
 */

describe("Bindings", function () {
  let setup = function () {
    let element = document.createElement('div');
    element.setAttribute('class', '${classes}');
    element.setAttribute('hidden', '${isHidden}');
    element.setAttribute('disabled', '${numValue}');
    element.setAttribute('onclick', '${raiseClick}');
    element.setAttribute('data-value', "13");
    element.setAttribute('data-method-value', "${getMethodValue}");
    element.innerHTML = "Description: ${description}";

    let boundContext = {
      index: 3
    };

    let context = {
      classes: "alert-warning",
      isHidden: true,
      displayChild: false,
      numValue: 5,
      getIsHidden(dataBoundContext) {
        return boundContext.index == 4;
      },
      getDataBoundHidden(dataBoundContext) {
        return dataBoundContext.domElement.getAttribute("data-sub-value") == "12";
      },
      getMethodValue(dataBoundContext) {
        return dataBoundContext.domElement.getAttribute("data-value");
      },
      raiseClick() {
        element.setAttribute('class', "alert-info");
      },
      raiseClick2(event, dataBoundContext) {
        element.setAttribute('data-bound-index', dataBoundContext.index.toString());
      },
      raiseClick3(event, dataBoundContext) {
        dataBoundContext.domElement.setAttribute("data-clicked", "true");
      },
      description: "Basic element binding example."
    };
    return {
      element: element,
      boundContext: boundContext,
      context: context
    }
  };

  describe("Attribute Binding", function () {
    it('should equal ' + data.context.classes + ' after render', function () {
      let data = setup();
      let attrBinding = new DataBoundAttribute(data.element.attributes.class);
      attrBinding.renderWithContext(data.context, data.boundContext, null);
      expect(data.element.getAttribute('class')).to.deep.equal(data.context.classes);
    });
  })
});