function Game(width, height)
{
    this.score = 0;
    this.playerBoard = new Board(width, height);
    this.computerBoard = new Board(width, height);
}

