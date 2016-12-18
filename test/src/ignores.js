/**
 * Created by chad on 12/18/16.
 */

describe("Ignores", function () {
  let setup = function () {
    let element = document.createElement("div");

    let ignoreChild = document.createElement("div");
    ignoreChild.setAttribute("data-bound-ignore", "");
    ignoreChild.innerHTML = "${childText}";

    element.appendChild(ignoreChild);

    return {
      domElement: element,
      child: ignoreChild,
      context: {
        childText: "This text shouldn't appear."
      }
    }
  };

  describe("Simple Ignore", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.domElement);
    boundElement.renderWithContext(data.context);
    it(`child element's innerHTML should be unchanged`, function () {
      expect(data.child.innerHTML).to.deep.equal("${childText}");
    });
  });
});