import "./styles/styles.css";
import { arrayChapters } from "./allChapters";
import { fillBooks, bookArray } from "./helper";

export let key = "";
export let bibleVersion = ``;

let paid = "";
let revision = "";
let typeContent = ``;

let countVerse = 0;
let initStartRange = false;
let statusSrc;

let allQuery = 0;
let countQuery = 0;

const contentArray = [];
const needBooks = [];

window.addEventListener("DOMContentLoaded", () => {
  const keySrc = document.querySelector("#key-src");
  const paiSrc = document.querySelector("#paid-src");
  const revSrc = document.querySelector("#rev-src");
  const contentSrc = document.querySelector("#content-src");
  statusSrc = document.querySelector("#status-src");

  const download = document.querySelector(".download");
  download.addEventListener("click", function () {
    key = keySrc.value;
    paid = paiSrc.value;
    revision = revSrc.value;
    typeContent = contentSrc.value;
    countQuery = 0;

    bibleVersion = `${paid}-${revision}`;
    fillGlobal();
  });

  async function fillGlobal() {
    await fillBooks();
    fillNeedBooks();
    await fillContent().then(() => saveText(contentArray));
  }

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
    let startRange = "123";
    let finishRange = "321";
    //учитываем запрос на intro
    allQuery = needBooks.length - 1;
    for (let index = 0; index < needBooks.length; index++) {
      countQuery = index;

      let item = needBooks[index];

      //Формирование content начинаем с GEN.intro
      if (item.chapterId.includes("intro") & (index === 0)) {
        await fillIntroContent(item.chapterId);
      } else {
        //Проверяем или был инициализирован стартовый адрес диапазона
        if (!initStartRange) {
          if (item.chapterId.includes("intro")) {
            index--;
            item = needBooks[index];
          }
          startRange = item.chapterId;
          initStartRange = true;
        }
        countVerse += item.countVerse;

        //Контролируем, чтобы количество стихов в запросе не превышало 200
        if (countVerse >= 200) {
          index--;
          item = needBooks[index];

          if (item.chapterId.includes("intro")) {
            index -= 2;
            item = needBooks[index];
          }

          finishRange = item.chapterId;
          initStartRange = false;
          countVerse = 0;

          await fillChapterContent(startRange, finishRange);
        }
        //Последний стих Библии всегда финишный диапазон запроса
        if (index === needBooks.length - 1) {
          item = needBooks[index];
          finishRange = item.chapterId;
          initStartRange = false;
          countVerse = 0;
          await fillChapterContent(startRange, finishRange);
        }
      }
    }
  }

  async function getDataVerse(startRange, finishRange) {
    const range = `${startRange}-${finishRange}`;
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/passages/${range}?content-type=${typeContent}&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`;

    try {
      let response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "API-Key": key,
        },
      });
      if (response.status === 200) {
        let data = await response.json();
        progressBarStatus();
        return data;
      } else {
        statusSrc.innerText = `STATUS: code:${response.status}, statusText:${response.statusText}`;
      }
    } catch (error) {
      statusSrc.innerText = `STATUS: ${error}`;
    }
  }
});

async function getAllVerses(chapterId) {
  const URL = `https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`;

  try {
    let response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "API-Key": key,
      },
    });

    if (response.status === 200) {
      let data = await response.json();
      progressBarStatus();
      return data;
    } else {
      statusSrc.innerText = `STATUS: code:${response.status}, statusText:${response.statusText}`;
    }
  } catch (error) {
    statusSrc.innerText = `STATUS: ${error}`;
  }
}

async function getIntroContent(chapterId) {
  const dataVerse = await getAllVerses(chapterId);
  return dataVerse.data.content;
}

async function saveText(arrayData) {
  let text = "";
  arrayData.forEach((element) => (text += JSON.stringify(element)));

  let blob = new Blob([text], { type: "text/plain" });
  let link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", `${bibleVersion}.js`);
  link.click();
}

function progressBarStatus() {
  const percentStatus = Math.round((countQuery / allQuery) * 100);
  statusSrc.innerText = `STATUS: package formation: ${percentStatus}%`;
}

function fillNeedBooks() {
  arrayChapters.forEach(function (element) {
    if (bookArray.includes(element.bookId)) {
      needBooks.push(element);
    }
  });
}
