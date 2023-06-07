import { ApiInterface } from "./ApiInterface";
import { ProgressStatus } from "./ProgressStatus";

class ScriptureSite {
  constructor(apiKey, statusSrc) {
    this.apiInterface = new ApiInterface(apiKey);
    this.progressStatus = new ProgressStatus(statusSrc);
  }

  async getBasic(url) {
    try {
      let data = await this.apiInterface.get(url);
      console.log("13", data);
      return data;
    } catch (error) {
      console.log(16, error);
      this.progressStatus.showError(error);
    }
  }
  async getAllBooks(bibleVersion) {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/books`;
    await this.getBasic(URL);
  }

  async getAllChapters(bibleVersion, book) {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/books/${book}/chapters`;
    await this.getBasic(URL);
  }

  async getDataVerse(bibleVersion, range, typeContent) {
    // const range = `${startRange}-${finishRange}`;
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/passages/${range}?content-type=${typeContent}&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`;

    await this.getBasic(URL);
  }

  async getAllVerses(chapterId) {
    const URL = `https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-01/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`;

    await this.getBasic(URL);
  }
}

export { ScriptureSite };
