class ProgressStatus {
  constructor(widget) {
    this.widget = widget;
    this.value = 0;
  }
  setAllValue(allValue) {
    this.allValue = allValue;
  }
  showValue() {
    this.value++;
    const percentStatus = Math.round((this.value / this.allValue) * 100);
    this.widget.innerText = `STATUS: package formation: ${percentStatus}%`;
  }
  showError(response) {
    this.widget.innerText = `STATUS: code:${response.status}, statusText:${response.statusText}`;
  }
}

export { ProgressStatus };
