/**
 * Created by chad on 12/10/16.
 */

class GalleryPageController extends PageController {
    constructor() {
        super();
        this.title = "Thousands Of Words";
        this.subTitle = "Without Text";

        this.data = galleryData;
        this.activeCatIndex = 0;
        this.imageMap = {};

        for (let i=0; i<this.data.categories.length; i++) {
            let cat = this.data.categories[i];
            let images = [];
            for(let i=0; i<this.data.images.length; i++) {
                let image = this.data.images[i];
                if (image.category == cat) {
                    images.push(image);
                }
            }
            this.imageMap[cat] = images;
        }

        this.data.categories.unshift("All");
        this.imageMap["All"] = this.data.images;

        this.activeCat = this.activeCat.bind(this);
        this.selectCat = this.selectCat.bind(this);
        this.catImageCount = this.catImageCount.bind(this);
    }

    get images() {
        return this.imageMap[this.categories[this.activeCatIndex]];
    }

    get categories() {
        return this.data.categories;
    }

    catImageCount(dataBoundContext) {
        return this.imageMap[this.categories[dataBoundContext.dataBoundIndex]].length;
    }

    activeCat(dataBoundContext) {
        return this.activeCatIndex == dataBoundContext.dataBoundIndex ? "active" : "";
    }

    selectCat(event, dataBoundContext) {
        this.activeCatIndex = dataBoundContext.dataBoundIndex;
        let cat = this.data.categories[this.activeCatIndex];
        this.subContext.renderWithContext(this);
    }
}