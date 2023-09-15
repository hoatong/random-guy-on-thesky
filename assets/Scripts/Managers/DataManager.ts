import { _decorator, Component, error, JsonAsset, Node, resources } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DataManager")
export class DataManager {
  static _instance: DataManager = null;
  static getInstance() {
    if (!this._instance) {
      this._instance = new DataManager();
    }
    return this._instance;
  }

  private _data: any = null;

  loadLevelData() {
    // Load and parse the levels.json file
    resources.load("config/levels", JsonAsset, (err, jsonAsset) => {
      if (err) {
        error("Failed to load levels.json:", err);
        return;
      }

      const jsonData = jsonAsset.json;
      this._data = jsonData.levels.map((levelData) => new LevelConfigData(levelData.width, levelData.height, levelData.maxMove));
    });
  }

  getData() {
    return this._data;
  }

  getLevelConfig(id: any) {
    return this._data[id];
  }
}

class LevelConfigData {
  width: number;
  height: number;
  maxMove: number;
  constructor(width, height, maxMove) {
    this.width = width;
    this.height = height;
    this.maxMove = maxMove;
  }
}
