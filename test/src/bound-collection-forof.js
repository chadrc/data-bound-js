/**
 * Created by chad on 12/20/16.
 */

describe("Bound Collection - Forof", function () {
  let setup = function () {
    let rootElement = document.createElement("div");
    let element = document.createElement("div");
    element.setAttribute("data-bound-forof", "${iterableObj}");
    element.innerHTML = "${.index}: ${.value}";
    rootElement.appendChild(element);

    return {
      element: rootElement,
      collectionElement: element
    }
  };
  describe("Array", function () {
    let data = setup();

    let context = {
      iterableObj: [10, 20, 30, 40, 50]
    };
    let boundCollection = new DataBoundForOfCollection(data.collectionElement);
    boundCollection.renderWithContext(context);

    let i = 0;
    for(let item of context.iterableObj) {
      let index = i;
      it(`Item ${index}'s innerHTML should equal '${index}: ${item}'`, function () {
        expect(data.element.children[index].innerHTML).to.deep.equal(`${index}: ${item}`);
      });
      i++;
    }
  });

  describe("Map", function () {
    let data = setup();
    let context = {
      iterableObj: new Map([["a", 1], ["b", 2], ["c", 3]])
    };
    data.collectionElement.innerHTML = "${0}: ${1}";
    let boundCollection = new DataBoundForOfCollection(data.collectionElement);
    boundCollection.renderWithContext(context);

    let i = 0;
    for(let item of context.iterableObj) {
      let index = i;
      console.log(item);
      it(`Item ${index}'s innerHTML should equal '${item[0]}: ${item[1]}'`, function () {
        expect(data.element.children[index].innerHTML).to.deep.equal(`${item[0]}: ${item[1]}`);
      });
      i++;
    }
  });
});