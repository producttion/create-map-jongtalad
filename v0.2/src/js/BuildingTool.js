import ConnectingTool from '../js/ConnectingTool';
import TileUtils from '../js/TileUtils';
import Tile from '../js/Tile';
import ZoneUtils from '../js/ZoneUtils';


import Index from '../Component/Index';


var BuildingTool = ConnectingTool(function (cost, centreTile, map, size, animated) {
  this.init(cost, map, true);
  this.centreTile = centreTile;
  this.size = size;
  this.animated = animated;
});


BuildingTool.prototype.putBuilding = function (leftX, topY) {
  var posX, posY, tileValue, tileFlags;
  var baseTile = this.centreTile - this.size - 1;

  for (var dy = 0; dy < this.size; dy++) {
    posY = topY + dy;

    for (var dx = 0; dx < this.size; dx++) {
      posX = leftX + dx;
      tileValue = baseTile;
      tileFlags = Tile.BNCNBIT;

      if (dx === 1) {
        if (dy === 1)
          tileFlags |= Tile.ZONEBIT;
        else if (dy === 2 && this.animated)
          tileFlags |= Tile.ANIMBIT;
      }

      this._worldEffects.setTile(posX, posY, tileValue, tileFlags);

      baseTile++;
    }
  }
};


BuildingTool.prototype.prepareBuildingSite = function (leftX, topY) {
  // Check that the entire site is on the map
  if (leftX < 0 || leftX + this.size > this._map.width)
    return this.TOOLRESULT_FAILED;

  if (topY < 0 || topY + this.size > this._map.height)
    return this.TOOLRESULT_FAILED;

  var posX, posY, tileValue;

  // Check whether the tiles are clear
  for (var dy = 0; dy < this.size; dy++) {
    posY = topY + dy;

    for (var dx = 0; dx < this.size; dx++) {
      posX = leftX + dx;

      tileValue = this._worldEffects.getTileValue(posX, posY);

      if (tileValue === Tile.DIRT)
        continue;

      if (!this.autoBulldoze) {
        // No Tile.DIRT and no bull-dozer => not buildable
        return this.TOOLRESULT_NEEDS_BULLDOZE;
      }

      if (!TileUtils.canBulldoze(tileValue)) {
        // tilevalue cannot be auto-bulldozed
        return this.TOOLRESULT_NEEDS_BULLDOZE;
      }

      this._worldEffects.setTile(posX, posY, Tile.DIRT);
      this.addCost(this.bulldozerCost);
    }
  }

  return this.TOOLRESULT_OK;
};


BuildingTool.prototype.buildBuilding = function (x, y) {
  // Correct to top left
  x--;
  y--;

  var prepareResult = this.prepareBuildingSite(x, y);
  if (prepareResult !== this.TOOLRESULT_OK)
    return prepareResult;

  this.addCost(this.toolCost);

  this.putBuilding(x, y);

  this.checkBorder(x, y);

  return this.TOOLRESULT_OK;
};


BuildingTool.prototype.doTool = function (x, y, blockMaps) {
  this.result = this.buildBuilding(x, y);
};


export default BuildingTool;

