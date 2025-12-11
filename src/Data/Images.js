// shuffles and selects background slideshow images

function setAssetName(baseString) {
    return "images/" + baseString + ".jpg";
} 

const shuffleArray = (array) => {
    //shuffle using Fisher-Yates method
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
  }

const mixArrays = function(...arrays) {
    //add arrays together
    let merged = [];
    for (let i=0; i < arrays.length; i++) {
        merged = merged.concat(arrays[i]);
    }
    merged = shuffleArray(merged);
    return merged;
  }


const movieImages = [ setAssetName("ns1"), setAssetName("pb1"), setAssetName("fall1"), setAssetName("berserk1"), setAssetName("nope"), setAssetName("ns2") ];

const TVImages = [ setAssetName("andor"), setAssetName("Succession"), setAssetName("carnivale"), setAssetName("hisDarkMaterials"), setAssetName("leftovers") ];

const VGImages = [ setAssetName("deathStranding"), setAssetName("eldenRing"), setAssetName("ff7"), setAssetName("journey2"), setAssetName("silksong") ];

let myImages = mixArrays(movieImages, TVImages, VGImages);

const updateImages = (category) => {
    myImages = movieImages;
    if ( category === 11 ){
        myImages = TVImages;
    } else if ( category === 9 ) {
        myImages = VGImages;   
    }
    myImages = shuffleArray(myImages);
}
  
export { myImages, updateImages };