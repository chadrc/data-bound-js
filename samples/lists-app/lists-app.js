/**
 * Created by chad on 12/4/16.
 */

class ListsApp {
    constructor() {
        let appInfo = JSON.parse(localStorage.getItem("listsAppInfo"));

        if (appInfo) {
            this.data = {
                lists: appInfo.lists,
                currentListIndex: appInfo.currentListIndex
            };
        } else {
            let myList = new List("My List");
            myList.items.push("List Item");

            this.data = {
                lists: [myList],
                currentListIndex: 0
            };

            this.save();
        }

        this.selectList = this.selectList.bind(this);
        this.createList = this.createList.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.addItemToCurrentList = this.addItemToCurrentList.bind(this);
        this.removeItemFromCurrentList = this.removeItemFromCurrentList.bind(this);

        this.element = new DataBoundElement(document.getElementById("lists-app"));
        this.element.renderWithContext(this);
    }

    get currentList() {
        return this.data.currentListIndex >= 0 && this.data.currentListIndex < this.data.lists.length
            ? this.data.lists[this.data.currentListIndex] : null;
    }

    get lists() {
        return this.data.lists;
    }

    selectList(event, dataBoundContext) {
        event.stopPropagation();
        this.data.currentListIndex = dataBoundContext.dataBoundIndex;
        this.element.renderWithContext(this);
        this.save();
    }

    createList(event, dataBoundContext) {
        event.preventDefault();
        let newListName = event.srcElement.elements.newListName.value;
        if (newListName != "") {
            this.data.lists.push(new List(newListName));
            this.element.renderWithContext(this);
            event.srcElement.reset();
            this.save();
        }
    }

    deleteList(event, dataBoundContext) {
        event.stopPropagation();
        let deleted = this.data.lists.splice(dataBoundContext.dataBoundIndex, 1);
        if (deleted[0] == this.currentList) {
            this.data.currentListIndex = -1;
        }
        this.element.renderWithContext(this);
        this.save();
    }

    addItemToCurrentList(event, dataBoundContext) {
        event.preventDefault();
        let newListItem = event.srcElement.elements.newListItem.value;
        if (newListItem != "") {
            this.currentList.items.push(newListItem);
            this.element.renderWithContext(this);
            event.srcElement.reset();
            this.save();
        }
    }

    removeItemFromCurrentList(event, dataBoundContext) {
        event.stopPropagation();
        this.currentList.items.splice(dataBoundContext.dataBoundIndex, 1);
        this.element.renderWithContext(this);
        this.save();
    }

    save() {
        localStorage.setItem("listsAppInfo", JSON.stringify(this.data));
    }
}

class List {
    constructor(name) {
        this.name = name;
        this.items = [];
    }
}

window.addEventListener('load', () => {
    let app = new ListsApp();
});
