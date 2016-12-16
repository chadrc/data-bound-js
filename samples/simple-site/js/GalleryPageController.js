/**
 * Created by chad on 12/10/16.
 */

class GalleryPageController extends PageController {
    constructor() {
        super();
        this.title = "Thousands Of Words";
        this.subTitle = "Without Text";

        this.data = galleryData;
    }

    get images() {
        return this.data.images;
    }

    get categories() {
        return this.data.categories;
    }
}