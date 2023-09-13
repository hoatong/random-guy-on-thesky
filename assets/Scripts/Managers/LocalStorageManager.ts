import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LocalStorageManager")
export class LocalStorageManager extends Component {
  private static instance: LocalStorageManager | null = null; // Static instance reference

  static getInstance() {
    if (LocalStorageManager.instance === null) {
      let sm = new Node("LocalStorageManager");
      LocalStorageManager.instance = sm.addComponent(LocalStorageManager);
      director.addPersistRootNode(sm); // Make the instance persistent
    }
    return LocalStorageManager.instance;
  }

  saveLevel(level: number) {
    localStorage.setItem("level", level.toString());
  }

  loadLevel() {
    const level = localStorage.getItem("level");
    if (level) {
      return Number(level);
    }
    return 0;
  }

  saveBoard(w, h, turnCount, matchedCount, boardState, boardPairs) {
    localStorage.setItem("boardWidth", w);
    localStorage.setItem("boardHeight", h);
    localStorage.setItem("turnCount", turnCount);
    localStorage.setItem("matchedCount", matchedCount);
    this.saveArray("boardState", boardState);
    this.saveArray("boardPairs", boardPairs);
  }

  loadBoard() {
    const w = localStorage.getItem("boardWidth");
    const h = localStorage.getItem("boardHeight");
    const turnCount = localStorage.getItem("turnCount");
    const matchedCount = localStorage.getItem("matchedCount");
    const boardState = this.loadArray("boardState");
    const boardPairs = this.loadArray("boardPairs");
    return { w, h, turnCount, matchedCount, boardState, boardPairs };
  }

  saveArray(key: string, arr: any[]) {
    const str = JSON.stringify(arr);
    localStorage.setItem(key, str);
  }

  loadArray(key: string) {
    const str = localStorage.getItem(key);
    if (str) {
      return JSON.parse(str);
    }
    return null;
  }
}
