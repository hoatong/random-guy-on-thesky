import { _decorator, AudioClip, AudioSource, Component, director, game, instantiate, Node, resources } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SoundManager")
export class SoundManager extends Component {
  //define sounds path
  static readonly BGM = "Sounds/bgm";
  static readonly BUTTON_EFFECT = "Sounds/button";
  static readonly WIN_EFFECT = "Sounds/win";
  static readonly CLICK_CARD_EFFECT = "Sounds/click";
  static readonly MATCH_CARD_EFFECT = "Sounds/match";
  static readonly MISMATCH_CARD_EFFECT = "Sounds/wrong";

  private audioSource: AudioSource = null;

  private static instance: SoundManager | null = null; // Static instance reference

  private loadedClips: { [key: string]: AudioClip } = {};

  static getInstance(): SoundManager | null {
    if (SoundManager.instance === null) {
      let sm = new Node("SoundManager");
      SoundManager.instance = sm.addComponent(SoundManager);
      SoundManager.instance.audioSource = sm.addComponent(AudioSource);
      director.addPersistRootNode(sm); // Make the instance persistent
    }
    return SoundManager.instance;
  }

  async loadAudioClip(path: string) {
    // load audio clip from resources folder
    if (this.loadedClips[path]) {
      return this.loadedClips[path];
    }

    return await new Promise((resolve, reject) => {
      resources.load(path, AudioClip, (err, clip) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        this.loadedClips[path] = clip;
        resolve(clip);
      });
    });
  }

  playBackgroundMusic() {
    this.loadAudioClip(SoundManager.BGM).then((clip: AudioClip) => {
      this.audioSource.clip = clip;
      this.audioSource.play();
    });
  }

  playEffect(path: string) {
    this.loadAudioClip(path).then((clip: AudioClip) => {
      this.audioSource.playOneShot(clip, 1);
    });
  }

  // playButtonEffect() {
  //   if (this.buttonEffect) {
  //     this.audioSource.playOneShot(this.buttonEffect, 1);
  //   }
  // }
  // playWinEffect() {
  //   if (this.winEffect) {
  //     this.audioSource.playOneShot(this.winEffect, 1);
  //   }
  // }
  // playClickCardEffect() {
  //   if (this.clickCardEffect) {
  //     this.audioSource.playOneShot(this.clickCardEffect, 1);
  //   }
  // }

  setMusicVolume(volume: number) {
    this.audioSource.volume = volume;
  }
}
