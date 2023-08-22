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
        text = JSON.stringify(arrayData, null, 2);
        break;
      default:
        typeContent = "txt";
        arrayData.forEach((element) => (text += JSON.stringify(element)));
        break;
    }

    let blob = new Blob([text], { type: typeMime });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${nameFile}.${typeContent}`);
    link.click();
  }
}
export { Keeper };
