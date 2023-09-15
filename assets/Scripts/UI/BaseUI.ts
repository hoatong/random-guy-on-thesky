import { _decorator, Color, Component, log, Node, Sprite, tween, Tween, UI, UIOpacity, UITransform, Vec3 } from "cc";
import { UIManager } from "../Managers/UIManager";
const { ccclass, property } = _decorator;

export interface UIClass<T extends BaseUI> {
  new (): T;
  getUrl(): string;
}

@ccclass("BaseUI")
export class BaseUI extends Component {
  protected static className = "BaseUI";

  @property(Node)
  background: Node = null;

  @property(Node)
  panel: Node = null;
  @property
  scaleWhenOpenAndClosePanelSize: Vec3 = new Vec3(1, 1, 1).multiplyScalar(1.02);

  uiOpacity = null;

  protected mTag: any;
  public get tag(): any {
    return this.mTag;
  }
  public set tag(value: any) {
    this.mTag = value;
  }

  public static getUrl(): string {
    log(this.className);
    return UIManager.PREFAB_UI_DIR + this.className;
  }

  onDestroy(): void {}

  onLoad() {
    // if (this.panel != null) {
    //   this.panel.active = false;
    // }
    this.background.getComponent(UITransform).setContentSize(this.node.parent.getComponent(UITransform).contentSize);

    this.uiOpacity = this.panel.addComponent(UIOpacity);

    if (this.panel != null) {
      this.panel.scale = Vec3.ZERO;
      this.panel.active = true;
      Tween.stopAllByTarget(this.panel);
      tween(this.uiOpacity).to(0, { opacity: 0 }).to(0.2, { opacity: 255 }).start();

      tween(this.panel)
        .to(0, { scale: Vec3.ZERO })
        .to(0.2, { scale: this.scaleWhenOpenAndClosePanelSize })
        .to(0.1, { scale: Vec3.ONE })
        .call(() => {
          log("BaseUI onShow Done");
        })
        .start();
    } else {
      this.panel.active = true;
    }
  }

  onEnable() {
    if (this.panel != null) {
      this.panel.scale = Vec3.ZERO;

      this.panel.active = true;
      Tween.stopAllByTarget(this.panel);
      tween(this.uiOpacity).to(0, { opacity: 0 }).to(0.2, { opacity: 255 }).start();
      tween(this.panel)
        .to(0, { scale: Vec3.ZERO })
        .to(0.2, { scale: this.scaleWhenOpenAndClosePanelSize })
        .to(0.1, { scale: Vec3.ONE })
        .call(() => {
          log("BaseUI onShow Done");
        })
        .start();
    } else {
      this.panel.active = true;
    }
  }

  onHide(callback: () => void) {
    if (this.panel != null) {
      Tween.stopAllByTarget(this.panel);
      tween(this.uiOpacity).to(0, { opacity: 255 }).to(0.2, { opacity: 0 }).start();
      tween(this.panel)
        .to(0.2, { scale: this.scaleWhenOpenAndClosePanelSize })
        .call(() => {
          this.node.active = false;
          if (callback) {
            callback();
          }
        })
        .start();
    } else {
      if (callback) {
        callback();
      }
    }
  }

  onShow(data) {}
}
