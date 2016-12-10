/**
 * Created by chad on 12/10/16.
 */

class HomePageController {
    constructor(boundElement) {
        this.title = "Welcome";
        this.subTitle = "Please Explore";

        this.boundElement = boundElement;
        this.boundElement.renderWithContext(this);
    }
}