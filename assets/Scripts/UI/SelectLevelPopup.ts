import { _decorator, Component, error, instantiate, JsonAsset, log, Node, resources } from "cc";
import { BaseUI } from "./BaseUI";
import { UIManager } from "../Managers/UIManager";
import { LevelListItem } from "../Components/LevelListItem";
import { DataManager } from "../Managers/DataManager";
const { ccclass, property } = _decorator;

@ccclass("SelectLevelPopup")
export class SelectLevelPopup extends BaseUI {
  protected static className = "SelectLevelPopup";

  @property(Node)
  levelListItem: Node = null;

  onItemClick: Function = null;

  onLoad() {
    super.onLoad();
    this.levelListItem.active = false;

    // Now you can use the loaded level configurations
    DataManager.getInstance()
      .getData()
      .forEach((levelConfig, index) => {
        // log(`Level ${index + 1} Config - Width: ${levelConfig.width}, Height: ${levelConfig.height}, Max Moves: ${levelConfig.maxMove}`);
        let levelItem = instantiate(this.levelListItem);
        levelItem.parent = this.levelListItem.parent;
        levelItem.active = true;
        levelItem.getComponent(LevelListItem).init(index, levelConfig, (id) => {
          if (this.onItemClick) this.onItemClick(id);
          this.onHide(() => {
            UIManager.getInstance().closeUI(SelectLevelPopup);
          });
        });
      });
  }

  onEnable() {
    super.onEnable();
  }

  onShow(data: any) {
    super.onShow(data);
    this.onItemClick = data.onItemClick;
  }

  onClose() {
    this.onHide(() => {
      UIManager.getInstance().closeUI(SelectLevelPopup);
    });
  }
}
