import { _decorator, Component, Label, log, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelListItem")
export class LevelListItem extends Component {
  onClick: Function = null;
  id = 0;
  @property(Label)
  label: Label = null;

  init(id: number, levelConfig: any, onClick: Function) {
    this.label.string = `Level ${levelConfig.width}x${levelConfig.height}`;
    this.id = id;
    this.onClick = onClick;
  }

  onSelectLevel() {
    if (this.onClick) {
      this.onClick(this.id);
    }
  }
}
