/**
 * Created by chad on 12/9/16.
 */

DataBoundUtils.debugMode = true;

class RootController {
    constructor() {

        this.currentPage = "home";
        this.pages = {
            home: new HomePageController(),
            about: new AboutPageController(),
            gallery: new GalleryPageController(),
            projects: new ProjectsPageController(),
            articles: new ArticlesPageController()
        };

        this.selectPage = this.selectPage.bind(this);
        this.activeClass = this.activeClass.bind(this);

        this.rootElement = new DataBoundElement(document.getElementById("simpleSiteRoot"));
        this.rootElement.renderWithContext(this);

        for (let p in this.pages) {
            if (this.pages.hasOwnProperty(p)) {
                this.pages[p].contextElement = this.rootElement.subContexts[p];
            }
        }
    }

    get currentPageName() {
        return this.currentPage;
    }

    get currentPageTitle() {
        let page = this.pages[this.currentPage];
        return page ? page.title : "";
    }

    get currentPageSubTitle() {
        let page = this.pages[this.currentPage];
        return page ? page.subTitle : "";
    }

    activeClass(dataBoundContext) {
        let ref = dataBoundContext.element.getAttribute("href").slice(1);
        let activePage = ref == this.currentPage;
        return activePage ? "active" : "";
    }

    selectPage(event, dataBoundContext) {
        this.currentPage = event.srcElement.dataset.page;
        this.rootElement.renderWithContext(this);
    }
}

class PageController {
    set contextElement(c) {
        this.subContext = c;
        c.renderWithContext(this);
    }
}

let rootCtrl = null;
window.addEventListener("load", function() {
    rootCtrl = new RootController();
});