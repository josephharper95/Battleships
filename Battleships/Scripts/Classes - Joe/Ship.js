function Ship(size, name)
{
    this.size = size;
    this.coordinates = [];
    this.addCoordinate = addCoordinate; // Easier way to add coordinate
    this.orientation = 0;
    this.flipOrientation = flipOrientation; // Controlled way to rotate ship
    this.name = name;
}

function addCoordinate(x, y)
{
    this.coordinates.push(new Coordinate(x, y));
}

function flipOrientation()
{
    if (this.orientation === 1)
    {
        this.orientation = 0;
    }
    else
    {
        this.orientation = 1;
    }
}