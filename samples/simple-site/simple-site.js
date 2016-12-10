/**
 * Created by chad on 12/9/16.
 */

class RootController {
    constructor() {

        this.currentPage = null;

        this.selectPage = this.selectPage.bind(this);
        this.activeClass = this.activeClass.bind(this);

        this.rootElement = new DataBoundElement(document.getElementById("simpleSiteRoot"));
        this.rootElement.renderWithContext(this);

        this.homeCtrl = new HomePageController(this.rootElement.refs.home);

        this.currentPage = this.homeCtrl;

        this.rootElement.renderWithContext(this);
    }

    get currentPageTitle() {
        return this.currentPage ? this.currentPage.title : "";
    }

    get currentPageSubTitle() {
        return this.currentPage ? this.currentPage.subTitle : "";
    }

    activeClass(dataBoundContext) {
        console.log(dataBoundContext);
    }

    selectPage(event, dataBoundContext) {
        console.log(dataBoundContext);
        this.currentPage = event.target.getAttribute("href").slice(1);;
    }
}

let rootCtrl = null;
window.addEventListener("load", function() {
    rootCtrl = new RootController();
});