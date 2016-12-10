/**
 * Created by chad on 12/9/16.
 */

class RootController {
    constructor() {

        this.currentPage = null;
        this.pages = {};

        this.selectPage = this.selectPage.bind(this);
        this.activeClass = this.activeClass.bind(this);
        this.isCurrentPage = this.isCurrentPage.bind(this);

        this.rootElement = new DataBoundElement(document.getElementById("simpleSiteRoot"));
        this.rootElement.renderWithContext(this);

        this.pages = {
            home: new HomePageController(this.rootElement.refs.home),
            about: new AboutPageController(this.rootElement.refs.about),
            gallery: new GalleryPageController(this.rootElement.refs.gallery),
            projects: new ProjectsPageController(this.rootElement.refs.projects),
            articles: new ArticlesPageController(this.rootElement.refs.articles)
        };
        this.currentPage = "home";

        this.rootElement.renderWithContext(this);
    }

    get currentPageTitle() {
        let page = this.pages[this.currentPage];
        return page ? page.title : "";
    }

    get currentPageSubTitle() {
        let page = this.pages[this.currentPage];
        return page ? page.subTitle : "";
    }

    isCurrentPage(dataBoundContext) {
        let ref = dataBoundContext.element.getAttribute("id");
        return ref == this.currentPage;
    }

    activeClass(dataBoundContext) {
        let ref = dataBoundContext.element.getAttribute("href").slice(1);
        let activePage = ref == this.currentPage;
        return activePage ? "active" : "";
    }

    selectPage(event, dataBoundContext) {
        this.currentPage = event.target.getAttribute("href").slice(1);
        this.rootElement.renderWithContext(this);
    }
}

let rootCtrl = null;
window.addEventListener("load", function() {
    rootCtrl = new RootController();
});