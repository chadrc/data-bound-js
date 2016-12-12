/**
 * Created by chad on 12/9/16.
 */

DataBoundUtils.debugMode = true;

class RootController {
    constructor() {

        this.currentPage = "home";
        this.pages = {};

        this.selectPage = this.selectPage.bind(this);
        this.activeClass = this.activeClass.bind(this);

        this.rootElement = new DataBoundElement(document.getElementById("simpleSiteRoot"));
        this.rootElement.renderWithContext(this);

        this.pages = {
            home: new HomePageController(this.rootElement.subContexts.home),
            about: new AboutPageController(this.rootElement.subContexts.about),
            gallery: new GalleryPageController(this.rootElement.subContexts.gallery),
            projects: new ProjectsPageController(this.rootElement.subContexts.projects),
            articles: new ArticlesPageController(this.rootElement.subContexts.articles)
        };

        this.rootElement.renderWithContext(this);
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

let rootCtrl = null;
window.addEventListener("load", function() {
    rootCtrl = new RootController();
});