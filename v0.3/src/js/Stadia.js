import Tile from '../js/Tile';



var emptyStadiumFound = function (map, x, y, simData) {
  simData.census.stadiumPop += 1;

  if (map.getTile(x, y).isPowered()) {
    // Occasionally start the big game
    if (((simData.cityTime + x + y) & 31) === 0) {
      map.putZone(x, y, Tile.FULLSTADIUM, 4);
      map.addTileFlags(x, y, Tile.POWERBIT);
      map.setTile(x + 1, y, Tile.FOOTBALLGAME1, Tile.ANIMBIT);
      map.setTile(x + 1, y + 1, Tile.FOOTBALLGAME2, Tile.ANIMBIT);
    }
  }
};


var fullStadiumFound = function (map, x, y, simData) {
  simData.census.stadiumPop += 1;
  var isPowered = map.getTile(x, y).isPowered();

  if (((simData.cityTime + x + y) & 7) === 0) {
    map.putZone(x, y, Tile.STADIUM, 4);
    if (isPowered)
      map.addTileFlags(x, y, Tile.POWERBIT);
  }
};


var Stadia = {
  registerHandlers: function (mapScanner, repairManager) {
    mapScanner.addAction(Tile.STADIUM, emptyStadiumFound);
    mapScanner.addAction(Tile.FULLSTADIUM, fullStadiumFound);
    repairManager.addAction(Tile.STADIUM, 15, 4);
  }
};


export default Stadia;

