import {embedImages, embedText} from "./util.js";

const imgPath = {
  "shelf1":  "../img/PXL_20230714_143344103.jpg",
  "shelf2":  "../img/PXL_20230714_143359454.jpg",
  "sunset":  "../img/PXL_20230728_003318809-EDIT.jpg",
  "shelf3":  "../img/PXL_20230728_202444623.jpg",
  "box":     "../img/PXL_20230728_202506171.jpg",
  "pet":     "../img/PXL_20230728_202558679.jpg",
  "shelfie": "../img/PXL_20230728_202642913.jpg",
};

const text = [
  "shelf",
  "books",
  "yellow box",
  "sunrise",
  "clouds",
  "sunset"
];

await embedImages( imgPath );
await embedText( text );