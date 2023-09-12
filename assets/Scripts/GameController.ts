import { _decorator, Component, instantiate, log, Node, Prefab, Size, Sprite, SpriteFrame, UITransform } from "cc";
import { Card } from "./Card";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  BOARD_WIDTH = 3;
  BOARD_HEIGHT = 4;

  cellWidth = 0;
  cellHeight = 0;

  cellPadding = 10;

  @property(Node)
  playBoard: Node = null;

  boardSize: Size = null;

  @property([SpriteFrame])
  cardImages: SpriteFrame[] = [];

  //card prefab
  @property(Prefab)
  card: Prefab = null;

  //game logic
  private flippedCards: Node[] = [];
  private matchedPairs = 0;

  start() {
    // log playBoard node size
    const uiTransform = this.playBoard.getComponent(UITransform);
    this.boardSize = uiTransform.contentSize;

    // calculate cell width
    this.cellWidth = (this.boardSize.width - this.cellPadding * (this.BOARD_WIDTH + 1)) / this.BOARD_WIDTH;
    // calculate cell height
    this.cellHeight = (this.boardSize.height - this.cellPadding * (this.BOARD_HEIGHT + 1)) / this.BOARD_HEIGHT;

    // log cell width and height
    console.log(`cell width: ${this.cellWidth}, cell height: ${this.cellHeight}`);
  }

  newGame() {
    // random board pairs
    const boardPairs = [];
    for (let i = 0; i < this.BOARD_WIDTH * this.BOARD_HEIGHT; i++) {
      boardPairs.push(Math.floor(i / 2));
    }
    // shuffle board pairs
    for (let i = 0; i < this.BOARD_WIDTH * this.BOARD_HEIGHT; i++) {
      const rand = Math.floor(Math.random() * (this.BOARD_WIDTH * this.BOARD_HEIGHT));
      const temp = boardPairs[i];
      boardPairs[i] = boardPairs[rand];
      boardPairs[rand] = temp;
    }
    log(boardPairs);

    // create cards
    for (let i = 0; i < this.BOARD_WIDTH; i++) {
      for (let j = 0; j < this.BOARD_HEIGHT; j++) {
        const c = instantiate(this.card) as Node;
        this.playBoard.addChild(c);

        //calculate card position
        let posX = this.cellPadding + this.cellWidth * i + this.cellPadding * i - this.boardSize.width / 2 + this.cellWidth / 2;
        let posY = this.cellPadding + this.cellHeight * j + this.cellPadding * j - this.boardSize.height / 2 + this.cellHeight / 2;
        c.setPosition(posX, posY);

        //set card size
        c.getComponent(UITransform).setContentSize(this.cellWidth, this.cellHeight);

        c.active = true;

        let cardType = boardPairs[j * this.BOARD_WIDTH + i];

        log("card type", cardType);
        c.getComponent(Card).init(cardType, this.cardImages[cardType], this.onCardClick.bind(this));
      }
    }
  }

  onCardClick(card: Node) {
    // log card position
    if (this.flippedCards.length < 2 && !card.getComponent(Card).isFlipped) {
      card.getComponent(Card).flip();
      this.flippedCards.push(card);

      if (this.flippedCards.length == 2) {
        //check if cards match
        if (this.flippedCards[0].getComponent(Card).cardType == this.flippedCards[1].getComponent(Card).cardType) {
          this.matchedPairs++;
          if (this.matchedPairs == (this.BOARD_WIDTH * this.BOARD_HEIGHT) / 2) {
            log("Game Over");
          }
        } else {
          if (this.flippedCards[0]) {
            setTimeout(this.delayFlipBack, 1000, this.flippedCards[0]);
          }
          if (this.flippedCards[1]) {
            setTimeout(this.delayFlipBack, 1000, this.flippedCards[1]);
          }
        }
        this.flippedCards = [];
      }
    }
  }

  delayFlipBack(c) {
    c.getComponent(Card).flipBack();
  }

  update(deltaTime: number) {}

  //random number generator
}
