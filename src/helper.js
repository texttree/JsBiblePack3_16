import { key, bibleVersion } from "./index";
export const bookArray = new Array();

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

async function fillChapters() {
  const arrChapters = new Array();

  bookArray.forEach(function (element) {
    getAllChapters(element).then(function (data) {
      const arrayChapter = data.data;
      arrayChapter.forEach(function (element) {
        arrChapters.push(element.id);
      });
    });
  });
  return arrChapters;
}

export async function fillBooks() {
  console.log(32);

  const data = await getBooks();
  data.data.forEach((element) => bookArray.push(element.id));
}

async function getBooks() {
  console.log(39);

  const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/books`;

  try {
    let response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "API-Key": key,
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getAllChapters(book) {
  const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/books/${book}/chapters`;

  try {
    let response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "API-Key": key.value,
      },
    });
    if (response.status === 200) {
      let data = await response.json();
      countQuery++;
      console.log("countQuery", countQuery);
      progressBasStatus();
      return data;
    } else {
      statusSrc.innerText = `STATUS: code:${response.status}, statusText:${response.statusText}`;
    }
    return data;
  } catch (error) {
    statusSrc.innerText = `STATUS: ${error}`;
  }
}
