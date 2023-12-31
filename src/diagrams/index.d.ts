export * from './rectangle';
export * from './circle';
export * from './svgPath';
export * from './diamond';
export * from './triangle';
export * from './pentagon';
export * from './pentagram';
export * from './hexagon';
export * from './arrow';
export * from './message';
export * from './cloud';
export * from './file';
export * from './cube';
export * from './people';
export * from './line';
export * from './iframe';
export * from './video';
import { rectangle } from './rectangle';
import { circle } from './circle';
import { svgPath } from './svgPath';
import { diamond } from './diamond';
import { triangle, triangleAnchors } from './triangle';
import { pentagon, pentagonAnchors } from './pentagon';
import { pentagram, pentagramAnchors } from './pentagram';
import { hexagon } from './hexagon';
import { leftArrow, rightArrow, twowayArrow } from './arrow';
import { message } from './message';
import { cloud } from './cloud';
import { file } from './file';
import { people } from './people';
import { line } from './line';
import { iframe } from './iframe';
import { video } from './video';
import { gif } from './gif';
import { mindNode, mindNodeAnchors } from './mindNode';
import { mindLine, mindLineAnchors } from './mindLine';
export declare function commonPens(): {
    rectangle: typeof rectangle;
    square: typeof rectangle;
    circle: typeof circle;
    svgPath: typeof svgPath;
    diamond: typeof diamond;
    triangle: typeof triangle;
    pentagon: typeof pentagon;
    pentagram: typeof pentagram;
    hexagon: typeof hexagon;
    leftArrow: typeof leftArrow;
    rightArrow: typeof rightArrow;
    twowayArrow: typeof twowayArrow;
    message: typeof message;
    cloud: typeof cloud;
    file: typeof file;
    people: typeof people;
    line: typeof line;
    iframe: typeof iframe;
    video: typeof video;
    gif: typeof gif;
    mindNode: typeof mindNode;
    mindLine: typeof mindLine;
};
export declare function commonAnchors(): {
    triangle: typeof triangleAnchors;
    pentagon: typeof pentagonAnchors;
    pentagram: typeof pentagramAnchors;
    mindNode: typeof mindNodeAnchors;
    mindLine: typeof mindLineAnchors;
};
