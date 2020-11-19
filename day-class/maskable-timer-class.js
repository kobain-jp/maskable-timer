class MasKableTimer {

  // constant status 
  static get STATUS_NOT_STARTED() { return 0 }
  static get STATUS_RUNNING() { return 1 }
  static get STATUS_FINISHED() { return 2 }

  constructor(elementId) {

    this.rootElement = document.getElementById(elementId);
    // set prop from data- tag
    this.maskStartTime = this.rootElement.dataset.maskStartTime || 0;
    this.maskEndTime = this.rootElement.dataset.maskEndTime || 0;
    if (this.rootElement.dataset.useBtn) {
      this.useBtn = this.rootElement.dataset.useBtn.toLowerCase() === "true";
    } else {
      this.useBtn = true;
    }
    this.maskFormat = this.rootElement.dataset.maskFormat || "??:???";
    this.timeFormat = this.rootElement.dataset.timeFormat || "ss:SSS";

    // init data
    this.startTime = 0;
    this.elapsedTime = 0;
    this.status = MasKableTimer.STATUS_NOT_STARTED;
    this.intervalId = 0;

    // createElement
    this.createElement();

  }

  start() {
    this.startTime = new Date();

    this.status = MasKableTimer.STATUS_RUNNING;

    this.intervalId = setInterval(function () {
      this.calcElapsedTime();
      this.renderDisplay();
    }.bind(this), 1);
    this.render();

  }

  stop() {
    clearInterval(this.intervalId);
    this.status = MasKableTimer.STATUS_FINISHED;
    this.render();
  }

  reset() {
    this.elapsedTime = 0;
    this.status = MasKableTimer.STATUS_NOT_STARTED;
    this.render();

  }

  calcElapsedTime() {
    this.elapsedTime = new Date().getTime() - this.startTime.getTime();
  }

  render() {
    this.renderDisplay();
    if (this.useBtn) {
      this.renderBtns();
    }
  }

  renderBtns() {

    this.startBtnElement.disabled = (this.status === MasKableTimer.STATUS_RUNNING || this.status === MasKableTimer.STATUS_FINISHED);
    this.stopBtnElement.disabled = this.status !== MasKableTimer.STATUS_RUNNING;
    this.resetBtnElement.disabled = this.status !== MasKableTimer.STATUS_FINISHED;

  }
  renderDisplay() {
    //Timer
    if (this.status == MasKableTimer.STATUS_RUNNING && this.elapsedTime > this.maskStartTime && this.elapsedTime < this.maskEndTime) {
      this.counterElement.innerHTML = this.maskFormat;
    } else {
      this.counterElement.innerHTML = dayjs(this.elapsedTime).format(this.timeFormat);
    }
  }
  createElement() {

    this.counterElement = document.createElement("div");
    this.rootElement.appendChild(this.counterElement);

    if (this.useBtn) {

      this.startBtnElement = document.createElement("input");
      this.startBtnElement.setAttribute("value", "start");
      this.startBtnElement.setAttribute("type", "button");
      this.startBtnElement.addEventListener("click", this.start.bind(this));
      this.rootElement.appendChild(this.startBtnElement);

      this.stopBtnElement = document.createElement("input");
      this.stopBtnElement.setAttribute("value", "stop");
      this.stopBtnElement.setAttribute("type", "button");
      this.stopBtnElement.addEventListener("click", this.stop.bind(this));
      this.rootElement.appendChild(this.stopBtnElement);

      this.resetBtnElement = document.createElement("input");
      this.resetBtnElement.setAttribute("value", "reset");
      this.resetBtnElement.setAttribute("type", "button");
      this.resetBtnElement.addEventListener("click", this.reset.bind(this));
      this.rootElement.appendChild(this.resetBtnElement);
    }

    this.render();
  }

}