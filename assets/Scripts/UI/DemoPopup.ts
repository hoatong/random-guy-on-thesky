import { _decorator, log } from "cc";
import { UIManager } from "../Managers/UIManager";
import { BaseUI } from "./BaseUI";
const { ccclass, property } = _decorator;

@ccclass("DemoPopup")
export class DemoPopup extends BaseUI {
  protected static className = "DemoPopup";

  onLoad() {
    super.onLoad();
  }

  onEnable() {
    super.onEnable();
  }

  onShow(data: null) {
    super.onShow(data);
    log("DemoPopup onShow", data);
  }

  onClose() {
    this.onHide(() => {
      UIManager.getInstance().closeUI(DemoPopup);
    });
  }
}
