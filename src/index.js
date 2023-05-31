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
    fillContent();
  });

  async function fillContent() {
    let data = await getDataVerse();

    contentAll += data.data.content;
    console.log(contentAll.length);
  }

  async function getDataVerse() {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/passages/${range}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`;

    try {
      let response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "API-Key": KEY,
        },
      });
      let data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
});

async function getAllChapters(book) {
  const URL = `https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/books/${book}/chapters`;

  try {
    let response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "API-Key": KEY,
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getBooks() {
  const URL =
    "https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/books";

  try {
    let response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "API-Key": KEY,
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function fillBooks() {
  const data = await getBooks();
  const arrayBooks = new Array();

  data.data.forEach((element) => arrayBooks.push(element.id));
  return arrayBooks;
}

async function fillChapters() {
  const arrayChapters = new Array();
  const arrayBooks = await fillBooks();
  console.log(arrayBooks);

  arrayBooks.forEach(function (element) {
    getAllChapters(element).then(function (data) {
      sleep(500);
      const arrayChapter = data.data;
      arrayChapter.forEach(function (element) {
        if (element.number !== "intro") {
          arrayChapters.push(element.id);
        }
      });
    });
  });
  return arrayChapters;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

fillChapters().then((data) => console.log(data));
