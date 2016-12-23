/**
 * Created by chad on 12/10/16.
 */

class ArticlesPageController extends PageController {
    constructor() {
        super();
        this.title = "Some Light Reading";
        this.subTitle = "Enjoy";

        this.data = ArticlesData;

        this.getCatCount = this.getCatCount.bind(this);
        this.getTagCount = this.getTagCount.bind(this);
        this.getUntaggedCount = this.getUntaggedCount.bind(this);
        this.catToggleChanged = this.catToggleChanged.bind(this);
        this.tagToggleChanged = this.tagToggleChanged.bind(this);
        this.allCatToggleChanged = this.allCatToggleChanged.bind(this);
        this.allTagToggleChanged = this.allTagToggleChanged.bind(this);
        this.untaggedToggleChanged = this.untaggedToggleChanged.bind(this);
        this.articleItemClicked = this.articleItemClicked.bind(this);
    }

    getCatCount(boundContext) {
        return this.data.catCounts[boundContext.index];
    }

    getTagCount(boundContext) {
        return this.data.tagCounts[boundContext.index];
    }

    getUntaggedCount(boundContext) {
        return this.data.untaggedCount;
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

    untaggedToggleChanged(event, boundContext) {
        console.log(arguments);
    }

    articleItemClicked(event, boundContext) {
        let article = this.data.articles[boundContext.index];
        console.log(article);
        let modal = this.subContext.boundElement.subContexts.articleModal;
        modal.renderWithContext(article);
        $(modal.domElement).modal("show");
    }
}