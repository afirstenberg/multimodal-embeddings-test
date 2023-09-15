import {argv} from 'process';
import {embedImage, embedText} from "./util.js";

const arg = argv.slice(2);

if( arg.length === 1 ){
  await embedText( arg[0] );

} else if( arg.length === 2 ){
  await embedImage( arg[0], arg[1] );

} else {
  console.error( "can't handle: ", arg );
}