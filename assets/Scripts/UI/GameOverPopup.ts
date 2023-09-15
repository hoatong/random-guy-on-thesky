import { _decorator, Component, game, Label, log, Node } from "cc";
import { BaseUI } from "./BaseUI";
import { UIManager } from "../Managers/UIManager";
const { ccclass, property } = _decorator;

@ccclass("GameOverPopup")
export class GameOverPopup extends BaseUI {
  protected static className = "GameOverPopup";

  @property(Label)
  title: Label = null;

  @property(Label)
  message: Label = null;

  onPlayAgainCallback: Function = null;
  onSelectLevelCallback: Function = null;

  onLoad() {
    super.onLoad();
  }

  onEnable() {
    super.onEnable();
  }

  onShow(data: any) {
    super.onShow(data);
    log("DemoPopup onShow", data);
    this.onPlayAgainCallback = data.onPlayAgain;
    this.onSelectLevelCallback = data.onSelectLevel;
    this.title.string = data.title;
    this.message.string = data.message;
  }

  onClose() {
    this.onHide(() => {
      UIManager.getInstance().closeUI(GameOverPopup);
    });
  }

  onPlayAgainButtonClicked() {
    if (this.onPlayAgainCallback) {
      this.onPlayAgainCallback();
    }
    game.emit("Game.EVENT_RESET");
    this.onClose();
  }

  onSelectLevelButtonClicked() {
    if (this.onSelectLevelCallback) {
      this.onSelectLevelCallback();
    }
    game.emit("Game.EVENT_SELECT_LEVEL");
    this.onClose();
  }
}
