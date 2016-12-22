/**
 * Created by chad on 12/10/16.
 */

class ArticlesPageController extends PageController {
    constructor() {
        super();
        this.title = "Some Light Reading";
        this.subTitle = "Enjoy";

        this.data = ArticlesData;

        this.catToggleChanged = this.catToggleChanged.bind(this);
        this.tagToggleChanged = this.tagToggleChanged.bind(this);
        this.allCatToggleChanged = this.allCatToggleChanged.bind(this);
        this.allTagToggleChanged = this.allTagToggleChanged.bind(this);
    }

    catToggleChanged(event, boundContext) {
        console.log(arguments);
    }

    allCatToggleChanged(event, boundContext) {
        console.log(arguments);
    }

    tagToggleChanged(event, boundContext) {
        console.log(arguments);
    }

    allTagToggleChanged(event, boundContext) {
        console.log(arguments);
    }
}