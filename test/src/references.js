/**
 * Created by chad on 12/18/16.
 */

describe("References", function () {
  let setup = function () {
    let element = document.createElement("div");

    let refChild = document.createElement("div");
    refChild.setAttribute("data-bound-ref", "child1");

    element.appendChild(refChild);

    let testContext = {
      childRefFound: null
    };

    return {
      domElement: element,
      refChild: refChild,
      context: {
        childReference: "contextChildReference",
        childRefMethod(ref) {
          testContext.childRefFound = ref;
        }
      },
      testContext: testContext
    }
  };

  describe("Simple reference", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.domElement);
    it(`'child1' reference should equal the child element`, function () {
      expect(boundElement.refs.child1.domElement).to.deep.equal(data.refChild);
    });
  });

  describe("Implicted reference with id attribute", function () {
    let data = setup();
    data.refChild.setAttribute("data-bound-ref", "");
    data.refChild.setAttribute("id", "child1");
    let boundElement = new DataBoundElement(data.domElement);
    it(`'child1' reference should equal the child element`, function () {
      expect(boundElement.refs.child1.domElement).to.deep.equal(data.refChild);
    });
  });
});