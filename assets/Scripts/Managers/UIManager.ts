import { _decorator, Camera, Canvas, Component, director, game, instantiate, log, Node, resources, UITransform, Vec3, Widget } from "cc";
import { BaseUI, UIClass } from "../UI/BaseUI";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  public static readonly PREFAB_UI_DIR = "Prefabs/UI/";

  private static instance: UIManager;
  private uiList: BaseUI[] = [];
  private uiRoot: Node = null;

  public static getInstance(): UIManager {
    if (this.instance == null) {
      let uiManagerNode = new Node("UIManager");
      this.instance = uiManagerNode.addComponent(UIManager);
      this.instance.addComponent(Canvas);
      director.addPersistRootNode(uiManagerNode);

      let canvas = director.getScene().getChildByName("Canvas");
      uiManagerNode.position = canvas.position;
      log("canvas", canvas.position);
      log("uiManagerNode", uiManagerNode.position);
      let canvasSize = canvas.getComponent(UITransform).contentSize;
      this.instance.uiRoot = new Node("Popup");
      this.instance.uiRoot.addComponent(UITransform);
      this.instance.uiRoot.getComponent(UITransform).setContentSize(canvasSize);
      this.instance.uiRoot.setParent(this.instance.node);
      this.instance.uiRoot.setPosition(Vec3.ZERO);
      this.instance.setWidget(this.instance.uiRoot, this.instance.node);
      this.instance.uiList = [];
    }
    return this.instance;
  }

  private setWidget(node: Node, parent: Node) {
    let widget = node.getComponent(Widget);
    if (widget == null) widget = node.addComponent(Widget);
    widget.target = parent;
    widget.left = 0;
    widget.top = 0;
    widget.bottom = 0;
    widget.right = 0;
    widget.updateAlignment();
  }

  public openUI<T extends BaseUI>(uiClass: UIClass<T>, zOrder?: number, callback?: Function, onProgress?: Function, ...args: any[]) {
    if (this.getUI(uiClass)) {
      return;
    }
    if (!this.uiRoot) {
      this.uiRoot = director.getScene().getChildByName("Canvas");
    }
    resources.load(
      uiClass.getUrl(),
      (completedCount: number, totalCount: number, item: any) => {
        if (onProgress) {
          onProgress(completedCount, totalCount, item);
        }
      },
      (error, prefab) => {
        if (error) {
          log(error);
          return;
        }
        if (this.getUI(uiClass)) {
          return;
        }
        let uiNode = instantiate(prefab) as unknown as Node;
        uiNode.parent = this.uiRoot;
        if (zOrder) {
          uiNode.setSiblingIndex(zOrder);
        }
        let ui = uiNode.getComponent(uiClass) as BaseUI;
        ui.tag = uiClass;
        this.uiList.push(ui);
        if (callback) {
          callback(ui, args);
        }
      }
    );
  }

  public closeUI<T extends BaseUI>(uiClass: UIClass<T>) {
    for (let i = 0; i < this.uiList.length; ++i) {
      if (this.uiList[i].tag === uiClass) {
        this.uiList[i].node.destroy();
        this.uiList.splice(i, 1);
        return;
      }
    }
  }

  public showUI<T extends BaseUI>(uiClass: UIClass<T>, data: any, callback?: Function) {
    let ui = this.getUI(uiClass);
    if (ui) {
      ui.node.active = true;
      ui.onShow(data);
      callback && callback(ui);
    } else {
      this.openUI(uiClass, 0, () => {
        let ui = this.getUI(uiClass);
        ui.onShow(data);
        callback && callback(ui);
      });
    }
  }

  public hideUI<T extends BaseUI>(uiClass: UIClass<T>) {
    let ui = this.getUI(uiClass);
    if (ui) {
      ui.node.active = false;
    }
  }

  public getUI<T extends BaseUI>(uiClass: UIClass<T>): BaseUI {
    for (let i = 0; i < this.uiList.length; ++i) {
      if (this.uiList[i].tag === uiClass) {
        return this.uiList[i];
      }
    }
    return null;
  }
}
