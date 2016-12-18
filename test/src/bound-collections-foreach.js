/**
 * Created by chad on 12/17/16.
 */

describe("Bound Collection - Foreach", function () {
  let setup = function () {
    let baseElement = document.createElement("ul");
    let childElement = document.createElement("li");
    childElement.setAttribute("data-bound-foreach", "${items}");
    childElement.innerHTML = "${.dataBoundIndex}: ${text}";
    baseElement.appendChild(childElement);
    return {
      domElement: baseElement,
      childElement: childElement,
      context: {
        itemClass: "item-class",
        items: [
          {text: "Item 1"},
          {text: "Item 2"},
          {text: "Item 3"},
          {text: "Item 4"}
        ]
      },
      dataBoundContext: {
        itemValue: "Parent Bound Context"
      }
    }
  };

  describe("Creating", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement);
    let baseChild = data.domElement.childNodes[0];
    it(`original child node should be replaced`, function () {
      expect(baseChild).to.not.deep.equal(data.childElement);
    });
  });

  describe("Child Count", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context);
    it(`child count of element should be equal to number of items plus one (for anchor)`, function () {
      expect(data.domElement.childNodes.length).to.deep.equal(data.context.items.length + 1);
    });
  });

  describe("Child Rendered Values", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context);
    for (let i=0; i<data.context.items.length; i++) {
      let childNode = data.domElement.childNodes[i];
      let childContext = data.context.items[i];
      it(`child ${i}'s innerHTML should equal '${i} : ${childContext.text}'`, function () {
        expect(childNode.innerHTML).to.deep.equal(i + ": " + childContext.text);
      });
    }
  });

  describe("Child value referencing parent context", function () {
    let data = setup();
    data.childElement.setAttribute("class", "${.arrayContext.itemClass}");
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context);
    for (let i=0; i<data.context.items.length; i++) {
      let childNode = data.domElement.childNodes[i];
      it(`child ${i}'s class attribute should equal ${data.context.itemClass}`, function () {
        expect(childNode.attributes.class.nodeValue).to.deep.equal(data.context.itemClass);
      });
    }
  });

  describe("Reference item value directly", function () {
    let data = setup();
    data.context.items = ["Item 1", "Item 2", "Item 3", "Item 4"];
    data.childElement.innerHTML = "${.contextValue}";
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context);
    for (let i=0; i<data.context.items.length; i++) {
      let childNode = data.domElement.childNodes[i];
      it(`child ${i}'s innerHTML should equal ${data.context.items[i]}`, function () {
        expect(childNode.innerHTML).to.deep.equal(data.context.items[i]);
      });
    }
  });

  describe("Reference parent bound context", function () {
    let data = setup();
    data.childElement.innerHTML = "${.dataBoundIndex}: ${.parent.itemValue}";
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context, data.dataBoundContext);
    for (let i=0; i<data.context.items.length; i++) {
      let childNode = data.domElement.childNodes[i];
      it(`child ${i}'s innerHTML should equal ${i} : ${data.dataBoundContext.itemValue}`, function () {
        expect(childNode.innerHTML).to.deep.equal(i + ": " + data.dataBoundContext.itemValue);
      });
    }
  });

  describe("Child count after adding items", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    data.context.items.push({text: "Item 5"});
    data.context.items.push({text: "Item 6"});
    data.context.items.push({text: "Item 7"});
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    it(`child count of element should be equal to number of items plus one (for anchor)`, function () {
      expect(data.domElement.childNodes.length).to.deep.equal(data.context.items.length + 1);
    });
  });

  describe("Child count after removing items", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    data.context.items.pop();
    data.context.items.pop();
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    it(`child count of element should be equal to number of items plus one (for anchor)`, function () {
      expect(data.domElement.childNodes.length).to.deep.equal(data.context.items.length + 1);
    });
  });

  describe("Order of children after removing items", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement);
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    data.context.items.splice(1, 2);
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    it(`child 0's innerHTML should equal '0: Item 1'`, function () {
      expect(data.domElement.childNodes[0].innerHTML).to.deep.equal("0: Item 1");
    });

    it(`child 1's innerHTML should equal '1: Item 4'`, function () {
      expect(data.domElement.childNodes[1].innerHTML).to.deep.equal("1: Item 4");
    });
  });

  describe("Child count after creation through bound element", function () {
    let data = setup();
    let boundElement = new DataBoundElement(data.domElement);
    boundElement.renderWithContext(data.context, data.dataBoundContext);

    it(`child count of element should be equal to number of items plus one (for anchor)`, function () {
      expect(data.domElement.childNodes.length).to.deep.equal(data.context.items.length + 1);
    });
  })
});