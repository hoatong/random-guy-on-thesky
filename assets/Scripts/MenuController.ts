import { _decorator, Component, Node, Toggle } from "cc";
import { ConfirmRestore } from "./Popups/ConfirmRestore";
import { LocalStorageManager } from "./Managers/LocalStorageManager";
import { GameController } from "./GameController";
import { SoundManager } from "./Managers/SoundManager";
const { ccclass, property } = _decorator;

@ccclass("MenuController")
export class MenuController extends Component {
  @property(Toggle)
  toggle1: Toggle = null;
  @property(Toggle)
  toggle2: Toggle = null;
  @property(Toggle)
  toggle3: Toggle = null;

  @property(ConfirmRestore)
  confirmRestore: ConfirmRestore = null;

  @property(GameController)
  gameController: GameController = null;

  start() {
    this.confirmRestore.node.active = false;
    const board = LocalStorageManager.getInstance().loadBoard();

    if (board.w && board.h && board.turnCount && board.matchedCount && board.boardState && board.boardPairs) {
      this.confirmRestore.show(
        () => {
          this.gameController.initBoard(Number(board.w), Number(board.h), Number(board.turnCount), Number(board.matchedCount), board.boardState, board.boardPairs);
        },
        () => {
          this.gameController.newGame(2, 2);
        }
      );
    }

    const level = LocalStorageManager.getInstance().loadLevel();
    switch (level) {
      case 0:
        this.toggle1.isChecked = true;
        break;
      case 1:
        this.toggle2.isChecked = true;
        break;
      case 2:
        this.toggle3.isChecked = true;
        break;
    }
  }

  onNewGameButtonClicked() {
    SoundManager.getInstance().playEffect(SoundManager.BUTTON_EFFECT);

    let level = LocalStorageManager.getInstance().loadLevel();
    switch (level) {
      case 0:
        this.gameController.newGame(2, 2);
        break;
      case 1:
        this.gameController.newGame(3, 3);
        break;
      case 2:
        this.gameController.newGame(5, 6);
        break;
    }
  }

  onSelectBoardSize(event, customEventData) {
    SoundManager.getInstance().playEffect(SoundManager.BUTTON_EFFECT);
    switch (customEventData) {
      case "0":
        this.gameController.newGame(2, 2);
        LocalStorageManager.getInstance().saveLevel(0);
        break;
      case "1":
        this.gameController.newGame(3, 3);
        LocalStorageManager.getInstance().saveLevel(1);
        break;
      case "2":
        this.gameController.newGame(5, 6);
        LocalStorageManager.getInstance().saveLevel(2);
        break;
    }
  }
}
