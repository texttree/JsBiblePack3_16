import "./styles/styles.css";
import { arrayChapters } from "./allChapters";
const KEY = "e9b2ca6a1b0abfc5c63fcda18a3036df";

// const arrayChapters = require('./allChapters)
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
let countVerse = 0;
let initStartRange = false;
const contentArray = new Array();

window.addEventListener("DOMContentLoaded", () => {
  // const urlSrc = document.querySelector("#url-src");
  const download = document.querySelector(".download");
  download.addEventListener("click", function () {
    fillContent();
  });

  async function fillIntroContent(chapterId) {
    const value = await getIntroContent(chapterId);
    contentArray.push({ chapterId: chapterId, content: value });
  }

  async function fillChapterContent(startRange, finishRange) {
    initStartRange = false;
    const value = await getDataVerse(startRange, finishRange);
    const contentVerse = value.data.content;
    const id = value.data.id;
    contentArray.push({
      chapterId: id,
      content: contentVerse,
    });
  }
  async function fillContent() {
    let startRange;
    let finishRange;

    for (let index = 0; index < arrayChapters.length; index++) {
      let item = arrayChapters[index];

      //Формирование content начинаем с GEN.intro
      if (item.chapterId.includes("intro") & (index === 0)) {
        await fillIntroContent(item.chapterId);
      } else {
        //Проверяем или был инициализирован стартовый адрес диапазона
        if (!initStartRange) {
          if (item.chapterId.includes("intro")) {
            index--;
            item = arrayChapters[index];
          }
          startRange = item.chapterId;
          initStartRange = true;
        }
        countVerse += item.countVerse;
        //Контролируем, чтобы количество стихов в запросе не превышало 200
        if (countVerse >= 200) {
          index--;
          item = arrayChapters[index];
          if (item.chapterId.includes("intro")) {
            index--;
            item = arrayChapters[index];
          }
          finishRange = item.chapterId;
          initStartRange = false;
          countVerse = 0;
          await fillChapterContent(startRange, finishRange);
        }
        //Последний стих Библии всегда финишный диапазон запроса
        if (index === arrayChapters.length - 1) {
          item = arrayChapters[index];
          finishRange = item.chapterId;
          initStartRange = false;
          countVerse = 0;
          await fillChapterContent(startRange, finishRange);
        }
      }
    }
    console.log(contentArray);
  }

  async function getDataVerse(startRange, finishRange) {
    const range = `${startRange}-${finishRange}`;
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

// Вспомогательные функции
//Список всех глав Библии
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

async function getAllVerses(chapterId) {
  const URL = `https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`;

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
  const arrChapters = new Array();
  const arrayBooks = await fillBooks();

  arrayBooks.forEach(function (element) {
    getAllChapters(element).then(function (data) {
      sleep(1000);
      const arrayChapter = data.data;
      arrayChapter.forEach(function (element) {
        arrChapters.push(element.id);
      });
    });
  });
  return arrChapters;
}

async function fillAllChaptersVerses() {
  const arrAllChaptersVerses = new Array();

  for (const item of arrayChapters) {
    const dataVerse = await getAllVerses(item);
    arrAllChaptersVerses.push({
      chapterId: item,
      countVerse: dataVerse.data.verseCount,
    });
  }
  return arrAllChaptersVerses;
}

async function getIntroContent(chapterId) {
  const dataVerse = await getAllVerses(chapterId);
  return dataVerse.data.content;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveText() {
  let stroka = "BlaBla Bla HHHmm";
  let blob = new Blob([stroka], { type: "text/plain" });
  let link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", "1.js");
  link.click();
}

// fillAllChaptersVerses().then((data) => console.log("data", data));
