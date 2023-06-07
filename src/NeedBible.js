import { Keeper } from "./Keeper";
import { ProgressStatus } from "./ProgressStatus";

import { ScriptureSite } from "./ScriptureSite";
import { GlobalBible } from "./GlobalBible";

class NeedBible {
  constructor(apiKey, bibleVersion, typeContent, statusSrc) {
    this.initStartRange = false;
    this.needBooks = [];
    this.contentArray = [];
    this.scriptureSite = new ScriptureSite(apiKey, statusSrc);
    this.countVerse = 0;
    this.bibleVersion = bibleVersion;
    this.typeContent = typeContent;
    this.progressStatus = new ProgressStatus(statusSrc);
  }

  fillNeedBooks() {
    const globalBible = new GlobalBible();
    globalBible.getAllChapters().forEach(function (element) {
      if (globalBible.getAllBooks().includes(element.bookId)) {
        this.needBooks.push(element);
      }
    }, this);
    this.progressStatus.setAllValue(this.needBooks.length - 1);
  }
  async fillGlobal() {
    let keeper = new Keeper();
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
      this.progressStatus.showValue();

      let item = this.needBooks[index];

      //Формирование content начинаем с GEN.intro
      if (item.chapterId.includes("intro") & (index === 0)) {
        await this.fillIntroContent(item.chapterId);
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

  async fillIntroContent(chapterId) {
    const value = await this.scriptureSite.getAllVerses(chapterId);
    console.log(value);
    this.contentArray.push({
      chapterId: chapterId,
      content: value.data.content,
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

    const contentVerse = value.data.content;
    const id = value.data.id;
    this.contentArray.push({
      chapterId: id,
      content: contentVerse,
    });
  }
}

export { NeedBible };
