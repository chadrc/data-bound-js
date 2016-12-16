/**
 * Created by chad on 12/15/16.
 */

let images = [];
let categories = ['Animals', 'Cars', 'Landscapes', 'Sets', 'Portraits'];

let maxSize = 300;
let increment = 50;
let rollMax = maxSize/increment;

for (let i=0; i<50; i++) {
    images.push({
        name: "Lorem ipsum",
        src: "blue-square.png",
        category: categories[Math.floor(Math.random()*categories.length)],
        width: Math.ceil(Math.random()*rollMax) * increment,
        height: Math.ceil(Math.random()*rollMax) * increment,
    })
}

let galleryData = {
    images: images,
    categories: categories
};
console.log(galleryData);