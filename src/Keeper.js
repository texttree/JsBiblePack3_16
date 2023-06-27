class Keeper {
  constructor() {}
  save(arrayData, nameFile, typeContent) {
    let text = "";
    if (typeContent === "text") {
      typeContent = "txt";
    }

    arrayData.forEach((element) => (text += JSON.stringify(element)));

    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${nameFile}.${typeContent}`);
    link.click();
  }
}

export { Keeper };
