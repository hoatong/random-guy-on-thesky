import { _decorator, Component, log, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HelloWorld")
export class HelloWorld extends Component {
  start() {
    log("Hello World!");
  }

  update(deltaTime: number) {}
}
