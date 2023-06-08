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
      return data;
    } catch (error) {
      this.progressStatus.showError(error.message);
    }
  }
  async getAllBooks(bibleVersion) {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/books`;

    const data = await this.getBasic(URL);
    return data.data;
  }

  async getAllChapters(bibleVersion, book) {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/books/${book}/chapters`;

    const data = await this.getBasic(URL);
    return data.data;
  }

  async getDataVerse(bibleVersion, range, typeContent) {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/passages/${range}?content-type=${typeContent}&include-notes=false&include-titles=true&include-chapter-numbers=true&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`;

    const data = await this.getBasic(URL);
    return data.data;
  }

  async getAllVerses(bibleVersion, chapterId) {
    const URL = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=true&include-verse-numbers=true&include-verse-spans=false`;

    const data = await this.getBasic(URL);
    return data.data;
  }
}

export { ScriptureSite };
