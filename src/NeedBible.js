import { Keeper } from "./Keeper";
import { ProgressStatus } from "./ProgressStatus";

import { ScriptureSite } from "./ScriptureSite";
import { GlobalBible } from "./GlobalBible";

class NeedBible {
  constructor(apiKey, bibleVersion, typeContent, statusSrc) {
    this.initStartRange = false;
    this.needBooks = [];
    this.allBooks = [];
    this.contentArray = [];
    this.scriptureSite = new ScriptureSite(apiKey, statusSrc);
    this.countVerse = 0;
    this.bibleVersion = bibleVersion;
    this.typeContent = typeContent;
    this.progressStatus = new ProgressStatus(statusSrc);
  }

  async fillAllBooks() {
    const data = await this.scriptureSite.getAllBooks(this.bibleVersion);
    data.forEach((element) => this.allBooks.push(element.id));
  }

  async fillNeedBooks() {
    const globalBible = new GlobalBible();
    globalBible.getAllChapters().forEach(function (element) {
      if (this.allBooks.includes(element.bookId)) {
        this.needBooks.push(element);
      }
    }, this);

    this.progressStatus.setAllValue(this.needBooks.length);
  }
  async fillGlobal() {
    let keeper = new Keeper();
    await this.fillAllBooks();
    this.fillNeedBooks();
    await this.fillContent().then(() =>
      keeper.save(this.contentArray, this.bibleVersion)
    );
  }

  async fillContent() {
    let startRange = "123";
    let finishRange = "321";

    //учитываем запрос на intro
    for (let index = 0; index < this.needBooks.length; index++) {
      this.progressStatus.showValue(index);

      let item = this.needBooks[index];

      //Формирование content начинаем с GEN.intro
      if (item.chapterId.includes("intro") & (index === 0)) {
        await this.fillIntroContent(this.bibleVersion, item.chapterId);
      } else {
        //Проверяем или был инициализирован стартовый адрес диапазона
        if (!this.initStartRange) {
          if (item.chapterId.includes("intro")) {
            index--;
            item = this.needBooks[index];
          }
          startRange = item.chapterId;
          this.initStartRange = true;
        }
        this.countVerse += item.countVerse;

        //Контролируем, чтобы количество стихов в запросе не превышало 200
        if (this.countVerse >= 200) {
          index--;
          item = this.needBooks[index];

          if (item.chapterId.includes("intro")) {
            index -= 2;
            item = this.needBooks[index];
          }

          finishRange = item.chapterId;
          this.initStartRange = false;
          this.countVerse = 0;

          await this.fillChapterContent(startRange, finishRange);
        }
        //Последний стих Библии всегда финишный диапазон запроса
        if (index === this.needBooks.length - 1) {
          item = this.needBooks[index];
          finishRange = item.chapterId;
          this.initStartRange = false;
          this.countVerse = 0;
          await this.fillChapterContent(startRange, finishRange);
        }
      }
    }
  }

  async fillIntroContent(bibleVersion, chapterId) {
    const value = await this.scriptureSite.getAllVerses(
      bibleVersion,
      chapterId
    );
    this.contentArray.push({
      chapterId: chapterId,
      content: value.content,
    });
  }

  async fillChapterContent(startRange, finishRange) {
    this.initStartRange = false;
    const range = `${startRange}-${finishRange}`;
    const value = await this.scriptureSite.getDataVerse(
      this.bibleVersion,
      range,
      this.typeContent
    );
    const contentVerse = value.content;
    const id = value.id;
    this.contentArray.push({
      chapterId: id,
      content: contentVerse,
    });
  }
}

export { NeedBible };
