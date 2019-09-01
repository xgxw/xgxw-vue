const defaultAutoSaveDuration: number = 60 * 1000;

export default class AutoSave {
  constructor(autoSaveFunc?: Function, autoSaveDuration?: number) {
    if (autoSaveFunc) { this.autosave = autoSaveFunc; }
    if (autoSaveDuration) { this.autoSaveDuration = autoSaveDuration; }
  }
  private isAutoSaveFile: boolean = false;
  private autoSaveDuration: number = defaultAutoSaveDuration;
  private autoSaveTimer: any;
  private autosave!: Function;
  start() {
    this.isAutoSaveFile = true;
    this.autoSaveTimer = setInterval(this.autosave, this.autoSaveDuration);
  }
  stop() {
    this.isAutoSaveFile = false;
    window.clearInterval(this.autoSaveTimer);
  }
  reset() {
    window.clearInterval(this.autoSaveTimer);
    this.autoSaveTimer = setInterval(this.autosave, this.autoSaveDuration);
  }
}
