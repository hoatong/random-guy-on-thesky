import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform } from "cc";
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

  isFlipped = false;

  start() {
    // handle touch event
    this.node.on(Node.EventType.TOUCH_END, () => {
      // log card position
      if (this.onClickCB) {
        this.onClickCB(this.node);
      }
    });
  }

  init(cardType: number, sprFrame: SpriteFrame, onClickCB: Function) {
    this.cardType = cardType;
    this.cardFrame = sprFrame;
    this.onClickCB = onClickCB;

    //scale sprite to fit card size
    const uiTransform = this.node.getComponent(UITransform);
    const size = uiTransform.contentSize;
    this.cardSpriteNode.getComponent(UITransform).setContentSize(size.width, size.height);
  }
  flip() {
    this.isFlipped = true;
    this.cardSpriteNode.spriteFrame = this.cardFrame;
  }
  flipBack() {
    this.isFlipped = false;
    this.cardSpriteNode.spriteFrame = this.backFrame;
  }
  update(deltaTime: number) {}
}
