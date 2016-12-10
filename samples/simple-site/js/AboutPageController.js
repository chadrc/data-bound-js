/**
 * Created by chad on 12/10/16.
 */

class AboutPageController {
    constructor(boundElement) {
        this.title = "Who We Are";
        this.subTitle = "Only Humble Developers Here";

        this.boundElement = boundElement;
        this.boundElement.renderWithContext(this);
    }
}