class Keeper {
  constructor() {}
  save(arrayData, nameFile) {
    let text = "";
    arrayData.forEach((element) => (text += JSON.stringify(element)));

    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${nameFile}.js`);
    link.click();
  }
}

export { Keeper };
