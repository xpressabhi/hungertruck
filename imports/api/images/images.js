var createThumb = function(fileObj, readStream, writeStream) {
  //console.log(fileObj);
  if (fileObj.imageOf === 'Truck') {
    gm(readStream).autoOrient().resize(400).gravity('Center').crop(400,300,0,0).stream().pipe(writeStream);
  }else {
    gm(readStream).autoOrient().resize(400).stream().pipe(writeStream);
  }

  //gm(readStream, fileObj.name()).resize(400).crop(400,300,0,0).stream().pipe(writeStream);
};

export const Images = new FS.Collection("images", {
  stores: [
    new FS.Store.FileSystem("images", {path: "/Users/abhishekmaurya/uploads",transformWrite: createThumb})
  ]
});
