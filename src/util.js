// noinspection SpellCheckingInspection

import fs from "fs";
import {GoogleVertexAIMultimodalEmbeddings} from "langchain/experimental/multimodal_embeddings/googlevertexai";
import {cosineSimilarity} from "langchain/util/math_utils";

const vectorFile = "./embeddings.json";
const timingsFile = "./timings.tsv";
const similarityFile = "./similarity.tsv";

export function loadVector(){
  const vectorStr = fs.readFileSync( vectorFile, {encoding: "utf-8"} );
  return JSON.parse( vectorStr );
}

export function saveVector( vector ){
  fs.writeFileSync( vectorFile, JSON.stringify( vector, null, 1 ) );
}

export function addTiming( data ){
  fs.writeFileSync( timingsFile, `${data.join('\t')}\n`, {flag:"a"} );
}

export function getStart(){
  return Date.now();
}

export function logEnd( start, key, info ){
  const end = Date.now();
  const dur = end - start;
  if( !info ){
    info = '-';
  }
  addTiming( [key, info, dur] );
}

export function buildSimilarity(){
  const data = loadVector();
  const keys = Object.keys(data).sort();
  const vectors = keys.map( key => data[key] );

  const similarity = cosineSimilarity( vectors, vectors );

  fs.writeFileSync( similarityFile, `\t${keys.join('\t')}\n`, {flag:"w"} );
  for( let co=0; co<keys.length; co++ ){
    fs.writeFileSync( similarityFile,`${keys[co]}\t${similarity[co].join('\t')}\n`, {flag:"a"});
  }
}

export async function embedImages( imgPath ){
  const vector = loadVector();
  const e = new GoogleVertexAIMultimodalEmbeddings();

  for( const key of Object.keys(imgPath) ){
    const path = imgPath[key];
    const vkey = `img_${key}`;
    const imgFile = fs.readFileSync( path );
    const start = getStart();
    const v = await e.embedImageQuery( imgFile );
    logEnd( start, vkey, path );
    vector[vkey] = v;
  }

  saveVector( vector );
}

export async function embedImage( name, path ){
  await embedImages({[name]: path});
}

export async function embedText( text ){

  if( !Array.isArray( text ) ){
    text = [text];
  }

  const vector = loadVector();
  const e = new GoogleVertexAIMultimodalEmbeddings();

  for( const key of text ){
    const vkey = `txt_${key}`;
    const start = getStart();
    const v = await e.embedQuery( key );
    logEnd( start, vkey, '-' )
    vector[vkey] = v;
  }

  saveVector( vector );
}

/*
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
*/