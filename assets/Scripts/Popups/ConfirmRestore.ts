import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ConfirmRestore")
export class ConfirmRestore extends Component {
  onYesCallback: Function = null;
  onNoCallback: Function = null;

  @property(Node)
  yesButton: Node = null;
  @property(Node)
  noButton: Node = null;

  show(onYesCallback, onNoCallback) {
    this.onYesCallback = onYesCallback;
    this.onNoCallback = onNoCallback;
    this.node.active = true;
  }

  start() {
    this.yesButton.on("click", this.onYesButtonClicked, this);
    this.noButton.on("click", this.onNoButtonClicked, this);
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
