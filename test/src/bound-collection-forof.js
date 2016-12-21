/**
 * Created by chad on 12/20/16.
 */

describe("Bound Collection - Forof", function () {
  describe("Array", function () {
    let rootElement = document.createElement("div");
    let element = document.createElement("div");
    element.setAttribute("data-bound-forof", "${arrayValue}");
    element.innerHTML = "${.index}: ${.value}";

    rootElement.appendChild(element);

    let context = {
      arrayValue: [10, 20, 30, 40, 50]
    };
    let boundCollection = new DataBoundForOfCollection(element);
    boundCollection.renderWithContext(context);

    let i = 0;
    for(let item of context.arrayValue) {
      let index = i;
      console.dir(rootElement);
      it(`Item ${index}'s innerHTML should equal '${index}: ${item}'`, function () {
        expect(rootElement.children[index].innerHTML).to.deep.equal(`${index}: ${item}`);
      });
      i++;
    }
  });
});