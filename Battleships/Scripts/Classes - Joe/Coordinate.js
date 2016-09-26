function Coordinate(x, y)
{
    this.x = x;
    this.getX = getX;
    this.y = y;
    this.getY = getY;
    this.isHit = false;
    this.getIsHit = getIsHit;
    this.containsShip = false;
}

function getIsHit()
{
    return this.isHit;
}

function containsShip()
{
    return this.containsShip;
}

function getX()
{
    return this.x;
}

function getY()
{
    return this.y;
}