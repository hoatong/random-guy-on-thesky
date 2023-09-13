import { _decorator, Component, instantiate, Label, log, Node, Prefab, Size, Sprite, SpriteFrame, UITransform } from "cc";
import { Card } from "./Card";
import { SoundManager } from "./Managers/SoundManager";
import { LocalStorageManager } from "./Managers/LocalStorageManager";

const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  BOARD_WIDTH = 2;
  BOARD_HEIGHT = 2;

  cellWidth = 0;
  cellHeight = 0;

  cellPadding = 10;

  @property(Node)
  playBoard: Node = null;

  @property(Label)
  turnCountLabel: Label = null;
  @property(Label)
  matchedCountLabel: Label = null;

  boardSize: Size = null;

  @property([SpriteFrame])
  cardImages: SpriteFrame[] = [];

  //card prefab
  @property(Prefab)
  card: Prefab = null;

  //game logic
  private flippedCards: Node[] = [];
  private matchedPairs = 0;
  private turnCount = 0;
  private boardPairs = [];
  private boardState = []; // 0: not flipped, 1: flipped, 2: matched

  initBoard(w, h, turnCount, matchedCount, boardState, boardPairs) {
    this.BOARD_WIDTH = w;
    this.BOARD_HEIGHT = h;
    this.turnCount = turnCount;
    this.matchedPairs = matchedCount;
    this.boardState = boardState;
    this.boardPairs = boardPairs;

    this.playBoard.removeAllChildren();

    const uiTransform = this.playBoard.getComponent(UITransform);
    this.boardSize = uiTransform.contentSize;
    // calculate cell width
    this.cellWidth = (this.boardSize.width - this.cellPadding * (this.BOARD_WIDTH + 1)) / this.BOARD_WIDTH;
    // calculate cell height
    this.cellHeight = (this.boardSize.height - this.cellPadding * (this.BOARD_HEIGHT + 1)) / this.BOARD_HEIGHT;

    // log cell width and height
    // console.log(`cell width: ${this.cellWidth}, cell height: ${this.cellHeight}`);

    let odd = (this.BOARD_HEIGHT * this.BOARD_WIDTH) % 2 == 1;

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

        let cardType = this.boardPairs[i * this.BOARD_HEIGHT + j];

        // log("card type", cardType);
        c.getComponent(Card).init(i * this.BOARD_HEIGHT + j, cardType, this.cardImages[cardType], this.onCardClick.bind(this));

        // flip cards
        let flipped = this.boardState.filter((x) => x == 1);
        if (this.boardState[i * this.BOARD_HEIGHT + j] == 1) {
          c.getComponent(Card).flip(false);
          if (flipped.length == 2) {
            setTimeout(this.delayFlipBack.bind(this), 1000, c);
          } else {
            this.flippedCards.push(c);
          }
        }
        if (this.boardState[i * this.BOARD_HEIGHT + j] == 2) {
          c.getComponent(Card).flip(false);
        }

        // hide odd card
        if (odd && cardType == Math.floor((this.BOARD_HEIGHT * this.BOARD_WIDTH) / 2)) {
          c.active = false;
        }
      }
    }
    this.updateLabels();
  }

  newGame(w, h) {
    SoundManager.getInstance().playEffect(SoundManager.BUTTON_EFFECT);

    this.BOARD_WIDTH = w;
    this.BOARD_HEIGHT = h;

    this.turnCount = 0;
    this.matchedPairs = 0;

    // random board pairs
    this.boardPairs = [];
    for (let i = 0; i < this.BOARD_WIDTH * this.BOARD_HEIGHT; i++) {
      this.boardPairs.push(Math.floor(i / 2));
    }

    //set up board state
    this.boardState = [];
    for (let i = 0; i < this.BOARD_WIDTH * this.BOARD_HEIGHT; i++) {
      this.boardState.push(0);
    }

    // shuffle board pairs
    for (let i = 0; i < this.BOARD_WIDTH * this.BOARD_HEIGHT; i++) {
      const rand = Math.floor(Math.random() * (this.BOARD_WIDTH * this.BOARD_HEIGHT));
      const temp = this.boardPairs[i];
      this.boardPairs[i] = this.boardPairs[rand];
      this.boardPairs[rand] = temp;
    }
    // log(this.boardPairs);

    this.initBoard(this.BOARD_WIDTH, this.BOARD_HEIGHT, this.turnCount, this.matchedPairs, this.boardState, this.boardPairs);
  }

  updateLabels() {
    this.turnCountLabel.string = `Turns: ${this.turnCount}`;
    this.matchedCountLabel.string = `Matched: ${this.matchedPairs}`;
  }

  onCardClick(card: Node) {
    SoundManager.getInstance().playEffect(SoundManager.BUTTON_EFFECT);
    // log card position
    if (this.flippedCards.length < 2 && !card.getComponent(Card).isFlipped) {
      card.getComponent(Card).flip();
      this.flippedCards.push(card);

      // update board state
      this.boardState[card.getComponent(Card).index] = 1;
      // log(this.boardState);
      if (this.flippedCards.length == 2) {
        this.turnCount++;
        //check if cards match
        if (this.flippedCards[0].getComponent(Card).cardType == this.flippedCards[1].getComponent(Card).cardType) {
          this.matchedPairs++;
          SoundManager.getInstance().playEffect(SoundManager.MATCH_CARD_EFFECT);
          this.boardState[this.flippedCards[0].getComponent(Card).index] = 2;
          this.boardState[this.flippedCards[1].getComponent(Card).index] = 2;
          if (this.matchedPairs == Math.floor((this.BOARD_WIDTH * this.BOARD_HEIGHT) / 2)) {
            log("Game Over");
            SoundManager.getInstance().playEffect(SoundManager.WIN_EFFECT);
          }
        } else {
          SoundManager.getInstance().playEffect(SoundManager.MISMATCH_CARD_EFFECT);
          if (this.flippedCards[0]) {
            setTimeout(this.delayFlipBack.bind(this), 1000, this.flippedCards[0]);
          }
          if (this.flippedCards[1]) {
            setTimeout(this.delayFlipBack.bind(this), 1000, this.flippedCards[1]);
          }
        }
        this.flippedCards = [];
        this.updateLabels();
      }
      LocalStorageManager.getInstance().saveBoard(this.BOARD_WIDTH, this.BOARD_HEIGHT, this.turnCount, this.matchedPairs, this.boardState, this.boardPairs);
    }
  }

  delayFlipBack(c) {
    c.getComponent(Card).flipBack();
    this.boardState[c.getComponent(Card).index] = 0;
    LocalStorageManager.getInstance().saveBoard(this.BOARD_WIDTH, this.BOARD_HEIGHT, this.turnCount, this.matchedPairs, this.boardState, this.boardPairs);
    // log(this.boardState);
  }

  update(deltaTime: number) {}

  //random number generator
}
