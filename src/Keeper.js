class Keeper {
  constructor() {}
  save(arrayData, nameFile, typeContent) {
    let text = "";
    let format;

    if (typeContent === "html") {
      format = "html";
    } else if (typeContent === "json") {
      format = "json";
    } else {
      format = "txt";
    }

    arrayData.forEach((element) => (text += JSON.stringify(element)));

    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${nameFile}.${format}`);
    link.click();
  }
}

export { Keeper };
