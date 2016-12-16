/**
 * Created by chad on 12/15/16.
 */

let images = [];
let categories = ['Animals', 'Cars', 'Landscapes', 'Sets', 'Portraits'];

let maxSize = 350;
let minSize = 200;

for (let i=0; i<50; i++) {
    images.push({
        name: "Lorem ipsum",
        src: "blue-square.png",
        category: categories[Math.floor(Math.random()*categories.length)],
        height: Math.ceil(Math.random()*(maxSize-minSize)) + minSize,
    })
}

let galleryData = {
    images: images,
    categories: categories
};