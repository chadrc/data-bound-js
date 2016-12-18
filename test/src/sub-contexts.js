/**
 * Created by chad on 12/18/16.
 */

describe("Sub Contexts", function () {
  let setup = function () {
    let rootElement = document.createElement("div");
    let child = document.createElement("h4");
    child.innerHTML = "${title}";
    rootElement.appendChild(child);

    let subContext = document.createElement("section");
    subContext.setAttribute("data-bound-context", "");
    subContext.setAttribute("id", "mySubContext");
    let subChild = document.createElement("span");
    subChild.innerHTML = "${description} of the ${~title} page";
    subContext.appendChild(subChild);

    rootElement.appendChild(subContext);

    return {
      rootElement: rootElement,
      rootChild: child,
      subContextElement: subContext,
      subContextChild: subChild,
      context: {
        title: "My Title",
        subContext: {
          description: "Page Description"
        }
      }
    }
  };

  describe("Sub Context Creation", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.rootElement);
    it(`'mySubContext' should exist as a subcontext on the bound element`, function () {
      expect(boundElement.subContexts.mySubContext).to.exist;
    });
  });

  describe("Root Render", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.rootElement);
    boundElement.renderWithContext(data.context);
    it(`sub context's child's innerHTML should be unchanged after root element render call`, function () {
      expect(data.subContextChild.innerHTML).to.deep.equal("${description} of the ${~title} page");
    });
  });

  describe("Sub Context Render", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.rootElement);
    boundElement.renderWithContext(data.context);
    let sub = boundElement.subContexts.mySubContext;
    sub.renderWithContext(data.context.subContext);
    it(`sub context's child's innerHTML should have been changed after sub context render call`, function () {
      expect(data.subContextChild.innerHTML).to.deep.equal(
        data.context.subContext.description + " of the " + data.context.title + " page");
    });
  });

  describe("Sub Context Render After Root Context Changed", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.rootElement);
    boundElement.renderWithContext(data.context);
    let sub = boundElement.subContexts.mySubContext;
    sub.renderWithContext(data.context.subContext);

    data.context.title = "My New Title";
    sub.renderWithContext(data.context.subContext);

    it(`sub context's child's innerHTML should reflect changes in root context after render`, function () {
      expect(data.subContextChild.innerHTML).to.deep.equal(
        data.context.subContext.description + " of the " + data.context.title + " page");
    });
  });

  describe("Root Render", function () {
    let data = setup();
    let newRoot = document.createElement("div");
    newRoot.appendChild(data.rootElement);

    let boundElement = new DataBoundElement(newRoot);

    it(`Sub contexts created by child elements should be referenceable by the root element`, function () {
      expect(boundElement.subContexts.mySubContext).to.exist;
    });
  });
});