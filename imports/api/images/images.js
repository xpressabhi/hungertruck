var createThumb = function(fileObj, readStream, writeStream) {
  // Transform the image into a 10x10px thumbnail
  //console.log(fileObj);
  //console.log(gm(readStream, fileObj.name()));
  gm(readStream, fileObj.name()).resize(400).stream().pipe(writeStream);
};

export const Images = new FS.Collection("images", {
  stores: [
    new FS.Store.FileSystem("images", {path: "/Users/abhishekmaurya/uploads",transformWrite: createThumb})
  ]
});
