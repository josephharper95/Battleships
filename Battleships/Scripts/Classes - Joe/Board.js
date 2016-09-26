function Board(height, width)
{
    this.ships = [];
    this.height = height;
    this.width = width;
    this.coordinates = [];
    this.placeShip = placeShip;
    this.getAdjacentLocations = getAdjacentLocations;
}

function placeShip(x, y, ship)
{
   count = 0; 
    while(count < ship.size)
    {
        if(ship.orientation = 0) //horizontal
        {
            ship.addCoordinate(x, y + count);
        }
        else //vertical
        {
            ship.addCoordinate(x + count, y);
        }
        count++;
    }
    this.ships.push(ship);
}

function getAdjacentLocations(coordinate)
{
    var adjacentLocations = [];
    if(coordinate.x >= this.width || coordinate.x < 0 || coordinate.y >= this.height || coordinate.y < 0)
    {
        return adjacentLocations;
    }

    if(coordinate.x < this.width - 1)
    {
        adjacentLocations.push(new Coordinate(coordinate.x + 1, coordinate.y));
    }
    if(coordinate.y < this.height - 1)
    {
        adjacentLocations.push(new Coordinate(coordinate.x, coordinate.y + 1));
    }
    if(coordinate.x > 0)
    {
        adjacentLocations.push(new Coordinate(coordinate.x -1, coordinate.y));
    }
    if(coordinate.y > 0)
    {
        adjacentLocations.push(new Coordinate(coordinate.x, coordinate.y - 1));
    }

    return adjacentLocations;
}