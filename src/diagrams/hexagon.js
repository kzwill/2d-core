export function hexagon(pen, ctx) {
    var path = !ctx ? new Path2D() : ctx;
    var _a = pen.calculative.worldRect, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    path.moveTo(x + width / 4, y);
    path.lineTo(x + (width * 3) / 4, y);
    path.lineTo(x + width, y + height / 2);
    path.lineTo(x + (width * 3) / 4, y + height);
    path.lineTo(x + (width * 1) / 4, y + height);
    path.lineTo(x, y + height / 2);
    path.lineTo(x + width / 4, y);
    path.closePath();
    if (path instanceof Path2D)
        return path;
}
// export function hexagonAnchors(pen: Pen) {
//   const anchors: Point[] = [];
//   anchors.push({
//     id: '0',
//     penId: pen.id,
//     x: 0.25,
//     y: 0,
//   });
//   anchors.push({
//     id: '1',
//     penId: pen.id,
//     x: 0.75,
//     y: 0,
//   });
//   anchors.push({
//     id: '2',
//     penId: pen.id,
//     x: 1,
//     y: 0.5,
//   });
//   anchors.push({
//     id: '3',
//     penId: pen.id,
//     x: 0.75,
//     y: 1,
//   });
//   anchors.push({
//     id: '4',
//     penId: pen.id,
//     x: 0.25,
//     y: 1,
//   });
//   anchors.push({
//     id: '5',
//     penId: pen.id,
//     x: 0,
//     y: 0.5,
//   });
//   pen.anchors = anchors;
// }
//# sourceMappingURL=hexagon.js.map