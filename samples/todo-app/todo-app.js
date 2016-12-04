/**
 * Created by chad on 12/4/16.
 */

class TodoApp {
    constructor() {
        this.lists = [];
        this.currentList = null;

        // Temp until functionality is implemented
        let myList = new TodoList("My List");
        myList.items.push("Feed Cats");
        myList.items.push("Program");
        myList.items.push("Play FFXV");

        let wishList = new TodoList("Wish List");
        wishList.items.push("Doughnut maker");
        wishList.items.push("Wolf bottle opener");
        wishList.items.push("New Rice Maker");
        wishList.items.push("Five more computers");

        this.lists.push(myList);
        this.lists.push(wishList);
        this.currentList = myList;

        // end temp

        this.selectList = this.selectList.bind(this);

        this.element = new DataBoundElement(document.getElementById("todo-app"));
        this.element.renderWithContext(this);
    }

    selectList(event, dataBoundContext) {
        this.currentList = this.lists[dataBoundContext.dataBoundIndex];
        this.element.renderWithContext(this);
    }
}

class TodoList {
    constructor(name) {
        this.name = name;
        this.items = [];
    }
}

window.addEventListener('load', () => {
    let app = new TodoApp();
});
