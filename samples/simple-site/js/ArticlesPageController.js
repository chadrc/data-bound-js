/**
 * Created by chad on 12/10/16.
 */

class ArticlesPageController extends PageController {
    constructor() {
        super();
        this.title = "Some Light Reading";
        this.subTitle = "Enjoy";

        this.data = ArticlesData;

        this.activeCatFilters = [];
        this.activeTagFilters = [];
        this.anyCat = false;
        this.anyTag = false;
        this.untaggedFilter = false;

        this.filteredArticles = this.data.articles;

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
        if (event.srcElement.checked) {
            this.activeCatFilters.push(boundContext.value);
        } else {
            let index = this.activeCatFilters.indexOf(boundContext.value);
            this.activeCatFilters.splice(index, 1);
        }
        this.filterArticles();
    }

    allCatToggleChanged(event, boundContext) {
        this.anyCat = event.srcElement.checked;
        this.filterArticles();
    }

    tagToggleChanged(event, boundContext) {
        if (event.srcElement.checked) {
            this.activeTagFilters.push(boundContext.value);
        } else {
            let index = this.activeTagFilters.indexOf(boundContext.value);
            this.activeTagFilters.splice(index, 1);
        }
        this.filterArticles();
    }

    allTagToggleChanged(event, boundContext) {
        this.anyTag = event.srcElement.checked;
        this.filterArticles();
    }

    untaggedToggleChanged(event, boundContext) {
        this.untaggedFilter = event.srcElement.checked;
        this.filterArticles();
    }

    articleItemClicked(event, boundContext) {
        let article = this.data.articles[boundContext.index];
        console.log(article);
        let modal = this.subContext.boundElement.subContexts.articleModal;
        modal.renderWithContext(article);
        $(modal.domElement).modal("show");
    }

    filterArticles() {
        this.filteredArticles = [];

        // If there are filters set, find matches
        if (this.activeCatFilters.length > 0 ||
            this.activeTagFilters.length > 0 ||
            this.untaggedFilter || this.anyCat || this.anyTag) {

            console.log(this.data.articles);
            for (let article of this.data.articles) {
                let catInFilter = false;
                if (this.activeCatFilters.indexOf(article.category) >= 0) {
                    catInFilter = true;
                }
                let catMatch = this.anyCat || catInFilter;

                let tagInFilter = false;
                if (article.tags.length == 0) {
                    tagInFilter = this.untaggedFilter;
                } else {
                    for (let tag of article.tags) {
                        if (this.activeTagFilters.indexOf(tag) >= 0) {
                            tagInFilter = true;
                            break;
                        }
                    }
                }

                let tagMatch = this.anyTag || tagInFilter;

                if (catMatch && tagMatch) {
                    this.filteredArticles.push(article);
                }
            }
        } else {
            // No filters set, show all articles
            this.filteredArticles = this.data.articles;
        }

        this.subContext.renderWithContext(this);
    }
}