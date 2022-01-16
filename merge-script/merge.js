var jimp = require('jimp')

var images = ['Feb1.png', 'image2.jpg'];


var jimps = [];

//Read the images and push the promises into the jimps array 
for(var i = 0; i < images.length; i++){
  jimps.push(jimp.read(images[i]));
}

//Merge two images
Promise.all(jimps).then(function(data){
   return Promise.all(jimps);
 }).then(function(data){
   data[1]
     .resize(756,756)
     .quality(90)
     .write('out.png', function(){
       console.log("Re-sized the image");
     });

    jimp.read('out.png').then(image => {
      data[0].composite(image,150,50);
      data[0].write('out1.png', function(){
        console.log("Wrote the image");
      });
    });
})

//In case we need to write on the image
Promise.all(jimps).then(function(data){
  return Promise.all(jimps);
}).then(function(data){
jimp.loadFont(jimp.FONT_SANS_128_WHITE).then(font => {
  data[0].print(font, 100, 300, 'HELLO WORLD');
  data[0].write('out2.png', function(){
      console.log("Wrote the image");
  });
});
})



