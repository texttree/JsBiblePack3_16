class Keeper {
  constructor() {}
  save(arrayData, nameFile, typeContent) {
    let text = "";
    let typeMime = "text/plain";

    switch (typeContent) {
      case "html":
        typeMime = "text/html";
        break;
      case "json":
        typeMime = "application/json";
        break;
      default:
        typeContent = "txt";
        break;
    }

    arrayData.forEach((element) => (text += JSON.stringify(element)));

    let blob = new Blob([text], { type: typeMime });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${nameFile}.${typeContent}`);
    link.click();
  }
}

export { Keeper };
