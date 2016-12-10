/**
 * Created by chad on 12/10/16.
 */

class GalleryPageController {
    constructor(boundElement) {
        this.title = "Thousands Of Words";
        this.subTitle = "Without Text";

        this.boundElement = boundElement;
        this.boundElement.renderWithContext(this);
    }
}