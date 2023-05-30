import "./styles/styles.css";
const KEY = "430545659461d43a53c383fed9970768";
// const URL = "https://api.scripture.api.bible/v1/bibles";
// const URL = "https://api.scripture.api.bible/v1/bibles/GEN";
// const URL = "https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01";
// const URL =
//   "https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/books";
// const URL =
// "https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/books/GEN";
// const URL = "https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/books/GEN/chapters";

const PAID = "9879dbb7cfe39e4d";
const revision = "01";
const bibleVersion = `${PAID}-${revision}`;
const range = "GEN.1-GEN.8";
let contentAll = "";

window.addEventListener("DOMContentLoaded", () => {
  // const urlSrc = document.querySelector("#url-src");
  const download = document.querySelector(".download");
  download.addEventListener("click", function () {
    console.log(21);
    fillContent();
  });

  async function fillContent() {
    contentAll += await getData();
    console.log(28);

    // contentAll += content;
    console.log(contentAll);
  }

  async function getData() {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/passages/${range}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`;
    fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "API-Key": KEY,
      },
    })
      .then((response) => response.json())
      .then(function (data) {
        console.log(46);
        return data;
      });
  }

  // if (response.ok) { // если HTTP-статус в диапазоне 200-299
  //   // получаем тело ответа (см. про этот метод ниже)
  //   let json = await response.json();
  // } else {
  //   alert("Ошибка HTTP: " + response.status);
  // }

  // const link = document.createElement("a");
  // const zipLink =
  //   "https://app.thedigitalbiblelibrary.org/entry/download_archive?id=d8bb452293f21682&license=30235&revision=1&type=release";
  // const zipName = "test.zip";

  // link.setAttribute("href", zipLink);
  // link.setAttribute("download", zipName);
  // link.setAttribute("target", "_blank");

  // link.style.display = "none";

  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  // });
});
