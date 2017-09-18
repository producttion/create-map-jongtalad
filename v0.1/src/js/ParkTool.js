import BaseTool from '../js/BaseTool';
import Random from '../js/Random';
import Tile from '../js/Tile';
import TileUtils from '../js/TileUtils';



var makeTool = BaseTool.makeTool;
var ParkTool = makeTool(function (map) {
  this.init(10, map, true);
});


ParkTool.prototype.doTool = function (x, y, blockMaps) {
  if (this._worldEffects.getTileValue(x, y) !== Tile.DIRT) {
    this.result = this.TOOLRESULT_NEEDS_BULLDOZE;
    return;
  }

  var value = Random.getRandom(4);
  var tileFlags = Tile.BURNBIT | Tile.BULLBIT;
  var tileValue;

  if (value === 4) {
    tileValue = Tile.FOUNTAIN;
    tileFlags |= Tile.ANIMBIT;
  } else {
    tileValue = value + Tile.WOODS2;
  }

  this._worldEffects.setTile(x, y, tileValue, tileFlags);
  this.addCost(10);
  this.result = this.TOOLRESULT_OK;
};


export default ParkTool;

