import ConnectingTool from '../js/ConnectingTool';
import EventEmitter from '../js/EventEmitter';
import Messages from '../js/Messages';
import Random from '../js/Random';
import Tile from '../js/Tile';
import TileUtils from '../js/TileUtils';
import ZoneUtils from '../js/ZoneUtils';




var BulldozerTool = EventEmitter(ConnectingTool(function (map) {
  this.init(10, map, true);
}));


BulldozerTool.prototype.putRubble = function (x, y, size) {
  for (var xx = x; xx < x + size; xx++) {
    for (var yy = y; yy < y + size; yy++) {
      if (this._map.testBounds(xx, yy)) {
        var tile = this._worldEffects.getTile(xx, yy);

        if (tile != Tile.RADTILE && tile != Tile.DIRT)
          this._worldEffects.setTile(xx, yy, Tile.TINYEXP + Random.getRandom(2), Tile.ANIMBIT | Tile.BULLBIT);
      }
    }
  }
};


BulldozerTool.prototype.layDoze = function (x, y) {
  var tile = this._worldEffects.getTile(x, y);

  if (!tile.isBulldozable())
    return this.TOOLRESULT_FAILED;

  tile = tile.getValue();
  tile = TileUtils.normalizeRoad(tile);

  switch (tile) {
    case Tile.HBRIDGE:
    case Tile.VBRIDGE:
    case Tile.BRWV:
    case Tile.BRWH:
    case Tile.HBRDG0:
    case Tile.HBRDG1:
    case Tile.HBRDG2:
    case Tile.HBRDG3:
    case Tile.VBRDG0:
    case Tile.VBRDG1:
    case Tile.VBRDG2:
    case Tile.VBRDG3:
    case Tile.HPOWER:
    case Tile.VPOWER:
    case Tile.HRAIL:
    case Tile.VRAIL:
      this._worldEffects.setTile(x, y, Tile.RIVER);
      break;

    default:
      this._worldEffects.setTile(x, y, Tile.DIRT);
      break;
  }

  this.addCost(1);

  return this.TOOLRESULT_OK;
};


BulldozerTool.prototype.doTool = function (x, y, blockMaps) {
  if (!this._map.testBounds(x, y))
    this.result = Tile.TOOLRESULT_FAILED;

  var tile = this._worldEffects.getTile(x, y);
  var tileValue = tile.getValue();

  var zoneSize = 0;
  var deltaX;
  var deltaY;

  if (tile.isZone()) {
    zoneSize = ZoneUtils.checkZoneSize(tileValue);
    deltaX = 0;
    deltaY = 0;
  } else {
    var result = ZoneUtils.checkBigZone(tileValue);
    zoneSize = result.zoneSize;
    deltaX = result.deltaX;
    deltaY = result.deltaY;
  }

  if (zoneSize > 0) {
    this.addCost(this.bulldozerCost);

    var dozeX = x;
    var dozeY = y;
    var centerX = x + deltaX;
    var centerY = y + deltaY;

    switch (zoneSize) {
      case 3:
        this._emitEvent(Messages.SOUND_EXPLOSIONHIGH);
        this.putRubble(centerX - 1, centerY - 1, 3);
        break;

      case 4:
        this._emitEvent(Messages.SOUND_EXPLOSIONLOW);
        this.putRubble(centerX - 1, centerY - 1, 4);
        break;

      case 6:
        this._emitEvent(Messages.SOUND_EXPLOSIONHIGH);
        this._emitEvent(Messages.SOUND_EXPLOSIONLOW);
        this.putRubble(centerX - 1, centerY - 1, 6);
        break;
    }

    this.result = this.TOOLRESULT_OK;
  } else {
    var toolResult;
    if (tileValue === Tile.RIVER || tileValue === Tile.REDGE || tileValue === Tile.CHANNEL) {
      toolResult = this.layDoze(x, y);

      if (tileValue !== this._worldEffects.getTileValue(x, y))
        this.addCost(5);
    } else {
      toolResult = this.layDoze(x, y);
      this.checkZoneConnections(x, y);
    }

    this.result = toolResult;
  }
};


export default BulldozerTool;

