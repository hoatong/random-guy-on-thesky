import { _decorator, Component, error, game, JsonAsset, log, Node, resources, Toggle, UITransform, Vec3, view } from "cc";
import { ConfirmRestore } from "./UI/ConfirmRestore";
import { LocalStorageManager } from "./Managers/LocalStorageManager";
import { GameController } from "./GameController";
import { SoundManager } from "./Managers/SoundManager";
import { UIManager } from "./Managers/UIManager";
import { DemoPopup } from "./UI/DemoPopup";
import { SelectLevelPopup } from "./UI/SelectLevelPopup";
import { DataManager } from "./Managers/DataManager";
const { ccclass, property } = _decorator;

@ccclass("MenuController")
export class MenuController extends Component {
  @property(GameController)
  gameController: GameController = null;

  @property(Node)
  infoMenu: Node = null;

  start() {
    const board = LocalStorageManager.getInstance().loadBoard();

    if (board.w && board.h && board.turnCount && board.matchedCount && board.boardState && board.boardPairs) {
      UIManager.getInstance().showUI(ConfirmRestore, {
        onYes: () => {
          this.gameController.initBoard(
            Number(board.w),
            Number(board.h),
            Number(board.turnCount),
            Number(board.matchedCount),
            board.boardState,
            board.boardPairs,
            Number(board.maxMove)
          );
        },
        onNo: () => {
          const levelConfig = DataManager.getInstance().getLevelConfig(0);
          LocalStorageManager.getInstance().saveLevel(0);
          this.gameController.newGame(levelConfig.width, levelConfig.height, levelConfig.maxMove);
        },
      });
    }

    DataManager.getInstance().loadLevelData();

    game.on("Game.EVENT_RESET", () => {
      this.onNewGameButtonClicked();
    });

    game.on("Game.EVENT_SELECT_LEVEL", () => {
      this.onSelectLevelButtonClicked(null, null);
    });
  }

  protected onDestroy(): void {
    game.off("Game.EVENT_RESET");
    game.off("Game.EVENT_SELECT_LEVEL");
  }

  onSelectLevelButtonClicked(event, customEventData) {
    UIManager.getInstance().showUI(SelectLevelPopup, {
      onItemClick: (id) => {
        const levelConfig = DataManager.getInstance().getLevelConfig(id);
        LocalStorageManager.getInstance().saveLevel(id);
        this.gameController.newGame(levelConfig.width, levelConfig.height, levelConfig.maxMove);
      },
    });
  }

  onNewGameButtonClicked() {
    const levelConfig = DataManager.getInstance().getLevelConfig(LocalStorageManager.getInstance().loadLevel());
    this.gameController.newGame(levelConfig.width, levelConfig.height, levelConfig.maxMove);
  }
}
