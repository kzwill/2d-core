export function triangle(pen) {
    var path = new Path2D();
    path.moveTo(pen.calculative.worldRect.x + pen.calculative.worldRect.width / 2, pen.calculative.worldRect.y);
    path.lineTo(pen.calculative.worldRect.x + pen.calculative.worldRect.width, pen.calculative.worldRect.y + pen.calculative.worldRect.height);
    path.lineTo(pen.calculative.worldRect.x, pen.calculative.worldRect.y + pen.calculative.worldRect.height);
    path.lineTo(pen.calculative.worldRect.x + pen.calculative.worldRect.width / 2, pen.calculative.worldRect.y);
    path.closePath();
    return path;
}
//# sourceMappingURL=triangle.js.map