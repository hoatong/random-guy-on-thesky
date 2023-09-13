import { _decorator, Component, Node, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Card")
export class Card extends Component {
  //callback
  onClickCB: Function = null;

  @property(Sprite)
  cardSpriteNode: Sprite = null;

  @property(SpriteFrame)
  backFrame: SpriteFrame = null;

  @property(SpriteFrame)
  cardFrame: SpriteFrame = null;

  cardType = -1;

  index = -1;

  isFlipped = false;

  start() {
    // handle touch event
    this.node.on(Node.EventType.TOUCH_END, () => {
      if (this.onClickCB) {
        this.onClickCB(this.node);
      }
    });
  }

  init(index: number, cardType: number, sprFrame: SpriteFrame, onClickCB: Function) {
    this.index = index;
    this.cardType = cardType;
    this.cardFrame = sprFrame;
    this.onClickCB = onClickCB;
    this.node.scale = new Vec3(1, 1, 1);

    //scale sprite to fit card size
    const uiTransform = this.node.getComponent(UITransform);
    const size = uiTransform.contentSize;
    this.cardSpriteNode.getComponent(UITransform).setContentSize(Math.min(size.width, size.height), Math.min(size.width, size.height));
  }
  flip(withAnim = true) {
    this.isFlipped = true;
    //tween scale to make it look like it's flipping
    Tween.stopAllByTarget(this.node);
    if (withAnim) {
      tween(this.node)
        .to(0.1, { scale: new Vec3(0, 1, 1) })
        .call(() => {
          this.cardSpriteNode.spriteFrame = this.cardFrame;
        })
        .to(0.1, { scale: new Vec3(1, 1, 1) })
        .start();
    } else {
      this.cardSpriteNode.spriteFrame = this.cardFrame;
    }
  }
  flipBack() {
    this.isFlipped = false;
    Tween.stopAllByTarget(this.node);
    //tween scale to make it look like it's flipping
    tween(this.node)
      .to(0.1, { scale: new Vec3(0, 1, 1) })
      .call(() => {
        this.cardSpriteNode.spriteFrame = this.backFrame;
      })
      .to(0.1, { scale: new Vec3(1, 1, 1) })
      .start();
  }
}
