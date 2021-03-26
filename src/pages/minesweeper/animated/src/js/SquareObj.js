export default class SquareObj{
  constructor(topLeftVertex, topRightVertex, bottomRightVertex, bottomLeftVertex, id, squareType, greyColor, tanColor, isFlagged, isChecked, total){
    this.topLeftVertex = topLeftVertex;
    this.topRightVertex = topRightVertex;
    this.bottomRightVertex = bottomRightVertex;
    this.bottomLeftVertex = bottomLeftVertex;
    this.id = id;
    this.squareType = squareType;
    this.total = total;
    this.greyColor = greyColor;
    this.tanColor = tanColor;
    this.isFlagged = isFlagged;
    this.isChecked = isChecked;
  }
}