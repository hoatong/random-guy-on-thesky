import { _decorator, Component, log, Node } from "cc";
import { BaseUI } from "./BaseUI";
import { UIManager } from "../Managers/UIManager";
const { ccclass, property } = _decorator;

@ccclass("ConfirmRestore")
export class ConfirmRestore extends BaseUI {
  protected static className = "ConfirmRestore";

  onYesCallback: Function = null;
  onNoCallback: Function = null;

  @property(Node)
  yesButton: Node = null;
  @property(Node)
  noButton: Node = null;

  onLoad() {
    super.onLoad();
    this.yesButton.on("click", this.onYesButtonClicked, this);
    this.noButton.on("click", this.onNoButtonClicked, this);
  }

  onEnable() {
    super.onEnable();
  }

  onShow(data: any) {
    super.onShow(data);
    log("DemoPopup onShow", data);
    this.onYesCallback = data.onYes;
    this.onNoCallback = data.onNo;
  }

  onClose() {
    this.onHide(() => {
      UIManager.getInstance().closeUI(ConfirmRestore);
    });
  }
  onYesButtonClicked() {
    if (this.onYesCallback) {
      this.onYesCallback();
      this.node.active = false;
    }
  }

  onNoButtonClicked() {
    if (this.onNoCallback) {
      this.onNoCallback();
      this.node.active = false;
    }
  }
}
