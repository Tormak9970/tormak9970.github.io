import Point from "./Point.js";

class Tetronimo {
  constructor(p1, p2, p3, p4, sColor, fColor, id){
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.origin1 = new Point(p1.x, p1.y);
    this.origin2 = new Point(p2.x, p2.y); 
    this.origin3 = new Point(p3.x, p3.y); 
    this.origin4 = new Point(p4.x, p4.y); 
    this.dx = 30;
    this.dy = 30;
    this. sColor = sColor;
    this.fColor = fColor;
    this.hasBeenHeld = false;
    this.id = id;
  }

  draw(ctx){
    ctx.strokeStyle = this.sColor;
    ctx.lineWidth = 3;
    ctx.fillStyle = this.fColor;
    this.p1.draw(ctx);
    this.p2.draw(ctx);
    this.p3.draw(ctx);
    this.p4.draw(ctx);
  }

  drawHeldTet(ctx){
    ctx.strokeStyle = this.sColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = this.fColor;
    this.p1.drawHeld(ctx, this.id);
    this.p2.drawHeld(ctx, this.id);
    this.p3.drawHeld(ctx, this.id);
    this.p4.drawHeld(ctx, this.id);
  }

  moveLeft(){
    this.p1.moveLeft(this.dx);
    this.p2.moveLeft(this.dx);
    this.p3.moveLeft(this.dx);
    this.p4.moveLeft(this.dx);
  }

  moveRight(){
    this.p1.moveRight(this.dx);
    this.p2.moveRight(this.dx);
    this.p3.moveRight(this.dx);
    this.p4.moveRight(this.dx);
  }
  
  moveDown(){
    this.p1.moveDown(this.dy);
    this.p2.moveDown(this.dy);
    this.p3.moveDown(this.dy);
    this.p4.moveDown(this.dy);
  }

  rotateLeft(){
    this.p1.rotateLeft(this.p1);
    this.p2.rotateLeft(this.p1);
    this.p3.rotateLeft(this.p1);
    this.p4.rotateLeft(this.p1);
  }

  rotateRight(){
    this.p1.rotateRight(this.p1);
    this.p2.rotateRight(this.p1);
    this.p3.rotateRight(this.p1);
    this.p4.rotateRight(this.p1);
  }
}

export default Tetronimo;
