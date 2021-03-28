class Point{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  draw(ctx){
    roundRect(ctx, this.x, this.y, 30, 30, 7.5, true, true);
  }

  drawHeld(ctx, id){
    if (id == 1 || id == 3 || id == 4){
      roundRect(ctx, this.x - 60, this.y + 60, 30, 30, 7.5, true, true);
    } else if (id == 5) {
      roundRect(ctx, this.x - 75, this.y + 75, 30, 30, 7.5, true, true);
    } else {
      roundRect(ctx, this.x - 75, this.y + 60, 30, 30, 7.5, true, true);
    }
  }

  moveLeft(dx){
    this.x -= dx;
  }

  moveRight(dx){
    this.x += dx;
  }

  moveDown(dy){
    this.y += dy;
  }

  rotateLeft(center){
    var returned = rotate(center.x, center.y, this.x, this.y, 270);
    this.x = returned[0];
    this.y = returned[1];
  }

  rotateRight(center){
    var returned = rotate(center.x, center.y, this.x, this.y, 90);
    this.x = returned[0];
    this.y = returned[1];
  }
}

function rotate(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}

export default Point;