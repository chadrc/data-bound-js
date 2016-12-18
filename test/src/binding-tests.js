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
      isHidden: false,
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
    let data = setup();
    it('should have value "' + data.context.classes + '" after render', function () {
      let attrBinding = new DataBoundAttribute(data.element.attributes.class);
      attrBinding.renderWithContext(data.context, data.boundContext, null);
      expect(data.element.getAttribute('class')).to.deep.equal(data.context.classes);
    });
  });

  describe("Text Node Binding", function () {
    let data = setup();
    it('should have value Description: "' + data.context.description + '" after render', function () {
      let binding = new DataBoundTextNode(data.element.childNodes[0]);
      binding.renderWithContext(data.context, data.boundContext);
      expect(data.element.childNodes[0].nodeValue).to.deep.equal("Description: " + data.context.description);
    })
  });

  describe("Boolean Binding", function() {
    beforeEach(function () {
      this.data = setup();
      this.binding = new DataBoundBooleanAttribute(this.data.element.attributes.hidden);
    });

    it('attribute should not be on element when rendered with false value', function () {
      this.binding.renderWithContext(this.data.context, this.data.boundContext);
      expect(this.data.element.attributes.hidden).to.not.exist;
    });

    it('attribute should be on element when rendered with true value', function () {
      this.data.context.isHidden = true;
      this.binding.renderWithContext(this.data.context, this.data.boundContext);
      expect(this.data.element.attributes.hidden).to.exist;
    });
  });

  describe("Method Binding", function () {
    let data = setup();
    let binding = new DataBoundMethodAttribute(data.element.attributes.onclick);
    binding.renderWithContext(data.context, data.boundContext);
    $(data.element).click();

    it('attribute "class" should have value "alert-info"', function () {
      expect(data.element.attributes.class.nodeValue).to.deep.equal("alert-info");
    });

    it(`onlick attribute should be removed`, function () {
      expect(data.element.attributes.onclick).to.not.exist;
    });

    it(`'data-bound-index' attribute should have value '3'`, function () {
      let data = setup();
      data.element.setAttribute("onclick", "${raiseClick2}");
      document.body.appendChild(data.element);
      let binding = new DataBoundMethodAttribute(data.element.attributes.onclick);
      binding.renderWithContext(data.context, data.boundContext);
      $(data.element).click();
      expect(data.element.attributes["data-bound-index"].nodeValue).to.deep.equal("3");
      document.body.removeChild(data.element);
    });
  });

  describe("Element Binding", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.element);
    boundElement.renderWithContext(data.context);

    it(`'class' attribute should have value '${data.context.classes}' after render`, function () {
      expect(data.element.attributes.class.nodeValue).to.deep.equal(data.context.classes)
    });

    it(`'hidden' attribute should be set on the element`, function () {
      expect(data.element.attributes.hidden).to.not.exist;
    });

    it(`'class' attribute should have value 'alert-info' after click`, function () {
      $(data.element).click();
      expect(data.element.attributes.class.nodeValue).to.deep.equal("alert-info");
    });

    it(`'data-click' should be true`, function () {
      let data = setup();
      data.element.setAttribute("onclick", "${raiseClick3}");
      document.body.appendChild(data.element);
      let binding = new DataBoundElement(data.element);
      binding.renderWithContext(data.context);
      $(data.element).click();
      expect(data.element.attributes["data-clicked"].nodeValue).to.deep.equal("true");
      document.body.removeChild(data.element);
    });

    it(`'data-method-value' attribute should equal 'data-value' attribute`, function () {
      let data = setup();
      let boundElement = new DataBoundElement(data.element);
      boundElement.renderWithContext(data.context);
      expect(data.element.getAttribute("data-method-value")).to.deep.equal(data.element.getAttribute("data-value"));
    })
  });

  describe("Sub Element", function () {
    let data = setup();
    let subElement = document.createElement('div');
    subElement.setAttribute("class", "${subClass}");
    subElement.innerHTML = "${subElementDesc}";
    data.context.subElementDesc = "This is a sub-element.";
    data.context.subClass = "my-sub-class";
    data.element.appendChild(subElement);
    let boundElement = new DataBoundElement(data.element);
    boundElement.renderWithContext(data.context);

    it(`sub element innerHTML should equal '${data.context.subElementDesc}'`, function () {
      expect(subElement.innerHTML).to.deep.equal(data.context.subElementDesc);
    });

    it(`sub element 'class' attribute should equal '${data.context.subClass}'`, function () {
      expect(subElement.getAttribute('class')).to.deep.equal(data.context.subClass);
    });
  });

  describe("Bound If", function () {
    let data = setup();
    let subElement = document.createElement('div');
    subElement.setAttribute("data-bound-if", "${displayChild}");
    data.element.appendChild(subElement);
    let boundIf = new DataBoundIfNode(subElement);
    boundIf.renderWithContext(data.context);

    it(`child count of element should equal 0`, function () {
      expect(data.element.childElementCount).to.deep.equal(0);
    });

    it(`child count should equal 1 after boolean switched to true and rendered`, function () {
      data.context.displayChild = true;
      boundIf.renderWithContext(data.context);
      expect(data.element.childElementCount).to.deep.equal(1);
    });
  });

  describe("Bound if through element binding", function () {
    let data = setup();
    let subElement = document.createElement('div');
    subElement.setAttribute("data-bound-if", "${displayChild}");
    data.element.appendChild(subElement);
    let boundIf = new DataBoundElement(data.element);
    boundIf.renderWithContext(data.context);

    it(`child count of element should equal 0`, function () {
      expect(data.element.childElementCount).to.deep.equal(0);
    });

    it(`child count should equal 1 after boolean switched to true and rendered`, function () {
      data.context.displayChild = true;
      boundIf.renderWithContext(data.context);
      expect(data.element.childElementCount).to.deep.equal(1);
    });
  })

  describe("Bound if with method accessing bound context", function () {
    let data = setup();
    let subElement = document.createElement('div');
    subElement.setAttribute("data-bound-if", "${getDataBoundHidden}");
    subElement.setAttribute("data-sub-value", "11");
    data.element.appendChild(subElement);
    let boundIf = new DataBoundElement(data.element);
    boundIf.renderWithContext(data.context);

    it(`child count of element should equal 0`, function () {
      expect(data.element.childElementCount).to.deep.equal(0);
    });

    it(`child count should equal 1 after boolean switched to true and rendered`, function () {
      subElement.setAttribute("data-sub-value", "12");
      boundIf.renderWithContext(data.context);
      expect(data.element.childElementCount).to.deep.equal(1);
    });
  });

  describe("Inner HTML Binding", function () {
    let data = setup();
    data.context.htmlValue = "<p>Some paragraph text with a <a href='#'>link</a>.</p>";
    data.element.setAttribute("data-bound-html", "${htmlValue}");
    let boundElement = new DataBoundElement(data.element);
    boundElement.renderWithContext(data.context);

    it(`element should have child element from innerHTML render`, function() {
      expect(data.element.childElementCount).to.deep.equal(1);
    });
  });

  describe("Image src proxy binding", function () {
    let data = setup();
    data.context.imageSrc= "https://www.site.com/myimage";
    data.element.setAttribute("data-bound-src", "${imageSrc}");
    let boundElement = new DataBoundElement(data.element);
    boundElement.renderWithContext(data.context);

    it(`'src' attribute should be set to '${data.context.imageSrc}'`, function () {
      expect(data.element.getAttribute('src')).to.deep.equal(data.context.imageSrc);
    })
  })
});