/**
 * Created by chad on 12/18/16.
 */

describe("Bound Collection - ForIn", function () {
  let setup = function () {
    let baseElement = document.createElement("ul");
    let childElement = document.createElement("li");
    childElement.setAttribute("data-bound-forin", "${obj}");
    childElement.innerHTML = "${.key}: ${.value}";
    baseElement.appendChild(childElement);
    return {
      domElement: baseElement,
      childElement: childElement,
      context: {
        itemClass: "item-class",
        obj: {
          firstName: "John",
          lastName: "Doe",
          email: "doe@example.com"
        }
      },
      dataBoundContext: {
        itemValue: "Parent Bound Context"
      }
    }
  };

  describe("Child Count", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement, "forin");
    elementArray.renderWithContext(data.context);
    it(`child count of element should be equal to number of items plus one (for anchor)`, function () {
      expect(data.domElement.childNodes.length).to.deep.equal(Object.keys(data.context.obj).length + 1);
    });
  });

  describe("Child Rendered Values", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement, "forin");
    elementArray.renderWithContext(data.context);
    let i = 0;
    for (let key in data.context.obj) {
      if (data.context.obj.hasOwnProperty(key)) {
        let childNode = data.domElement.childNodes[i];
        let childContext = data.context.obj;
        it(`child ${i}'s innerHTML should equal '${key} : ${childContext[key]}'`, function () {
          expect(childNode.innerHTML).to.deep.equal(key + ": " + childContext[key]);
        });
        i++;
      }
    }
  });

  describe("Child count after adding items", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement, "forin");
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    data.context.obj.colorPref = "red";
    data.context.obj.birthday = "Jan 1 2000";
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    it(`child count of element should be equal to number of items plus one (for anchor)`, function () {
      expect(data.domElement.childNodes.length).to.deep.equal(Object.keys(data.context.obj).length + 1);
    });
  });

  describe("Child count after removing items", function () {
    let data = setup();
    let elementArray = new DataBoundCollection(data.childElement, "forin");
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    delete data.context.obj.lastName;
    delete data.context.obj.firstName;
    elementArray.renderWithContext(data.context, data.dataBoundContext);

    it(`child count of element should be equal to number of items plus one (for anchor)`, function () {
      expect(data.domElement.childNodes.length).to.deep.equal(Object.keys(data.context.obj).length + 1);
    });
  });
});