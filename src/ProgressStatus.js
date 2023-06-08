class ProgressStatus {
  constructor(widget) {
    this.widget = widget;
  }
  setAllValue(allValue) {
    this.allValue = allValue;
  }
  showValue(value) {
    const percentStatus = Math.round((value / this.allValue) * 100);
    this.widget.innerText = `STATUS: package formation: ${percentStatus}%`;
  }
  showError(error) {
    this.widget.innerText = error;
  }
}

export { ProgressStatus };
