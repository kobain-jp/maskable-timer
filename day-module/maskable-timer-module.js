
const MaskableTimer = (function () {

    // constant
    const STATUS_NOT_STARTED = 0;
    const STATUS_RUNNING = 1;
    const STATUS_FINISHED = 2;

    return {

        init: function (elementId) {

            if (this.rootElement !== undefined) {
                throw new Error('already mounted');
            }
            // 
            this.rootElement = document.getElementById(elementId);
            // set dataset to variable
            this.maskStartTime = this.rootElement.dataset.maskStartTime || 0;
            this.maskEndTime = this.rootElement.dataset.maskEndTime || 0;
            if (this.rootElement.dataset.useBtn) {
                this.useBtn = this.rootElement.dataset.useBtn.toLowerCase() === "true";
            } else {
                this.useBtn = true;
            }
            this.maskFormat = this.rootElement.dataset.maskFormat || "??:???";
            this.timeFormat = this.rootElement.dataset.timeFormat || "ss:SSS";

            // init variable
            this.startTime = 0;
            this.elapsedTime = 0;
            this.status = STATUS_NOT_STARTED;
            this.intervalId = 0;

            this.compileElement();
            // or this.createElement();

        }, start: function () {
            this.startTime = new Date();
            this.status = STATUS_RUNNING;
            this.intervalId = setInterval(function () {
                this.calcElapsedTime();
                this.renderDisplay();
            }.bind(this), 1);
            this.render();

        }, stop: function () {
            clearInterval(this.intervalId);
            this.status = STATUS_FINISHED;
            this.render();
        }, reset: function () {
            this.elapsedTime = 0;
            this.status = STATUS_NOT_STARTED
            this.render();

        }, calcElapsedTime: function () {
            this.elapsedTime = new Date().getTime() - this.startTime.getTime();
        }, render: function () {
            this.renderDisplay();
            if (this.useBtn) {
                this.renderBtns();
            }
        }, renderBtns: function () {

            this.startBtnElement.disabled = (this.status === STATUS_RUNNING || this.status === STATUS_FINISHED);
            this.stopBtnElement.disabled = this.status !== STATUS_RUNNING;
            this.resetBtnElement.disabled = this.status !== STATUS_FINISHED;

        }, renderDisplay: function () {
            //Timer
            if (this.isRunning && this.elapsedTime > this.maskStartTime && this.elapsedTime < this.maskEndTime) {
                this.counterElement.innerHTML = this.maskFormat;
            } else {
                this.counterElement.innerHTML = dayjs(this.elapsedTime).format(this.timeFormat);
            }
        }, createElement: function () {

            //this.displayElement = document.createElement("div");

            this.rootElement.appendChild(this.displayElement);

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
        }, compileElement: function () {
            const templateId = this.useBtn ? "tpl-timer" : "tpl-timer-display-only";
            var template = document.querySelector('#' + templateId);
            this.rootElement.appendChild(template.content.cloneNode(true));

            this.counterElement = this.rootElement.children[0];

            if (this.useBtn) {
                this.startBtnElement = this.rootElement.children[1];
                this.stopBtnElement = this.rootElement.children[2];
                this.resetBtnElement = this.rootElement.children[3];
            }

            this.render();

        }

    }

}());
