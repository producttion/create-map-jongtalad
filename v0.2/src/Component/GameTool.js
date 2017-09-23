import EventEmitter from '../Component/EventEmitter';
import BulldozerTool from '../js/BulldozerTool';
import BuildingTool from '../js/BuildingTool';
import Tile from '../js/Tile';

export default function GameTool(map) {
    var tools = EventEmitter({
      bulldozer: new BulldozerTool(map),
      industrial: new BuildingTool(100, Tile.INDCLR, map, 3, false),

    });
  
    return tools;
  }