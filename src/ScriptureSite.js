import { ApiInterface } from "./ApiInterface";
import { ProgressStatus } from "./ProgressStatus";

class ScriptureSite {
  constructor(statusSrc) {
    this.apiInterface = new ApiInterface();
    this.progressStatus = new ProgressStatus(statusSrc);
    this.urlSite = `https://${localStorage.urlSite}`;
  }

  async getBasic(url) {
    try {
      let data = await this.apiInterface.get(url);
      return data;
    } catch (error) {
      this.progressStatus.showError(error.message);
    }
  }

  async getInfoBible(bibleVersion) {
    const URL = `${this.urlSite}/bibles/${bibleVersion}`;
    const data = await this.getBasic(URL);
    return data.data;
  }

  async getAllBooks(bibleVersion) {
    const URL = `${this.urlSite}/bibles/${bibleVersion}/books?include-chapters=true&include-chapters-and-sections=false`;

    const data = await this.getBasic(URL);
    return data.data;
  }

  async getAllChapters(bibleVersion, book) {
    const URL = `${this.urlSite}/bibles/${bibleVersion}/books/${book}/chapters`;

    const data = await this.getBasic(URL);
    return data.data;
  }

  async getDataVerse(bibleVersion, range, typeContent) {
    const URL = `${this.urlSite}/bibles/${bibleVersion}/passages/${range}?content-type=${typeContent}&include-notes=false&include-titles=true&include-chapter-numbers=true&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`;

    const data = await this.getBasic(URL);
    return data.data;
  }

  async getAllVerses(bibleVersion, chapterId) {
    const URL = `${this.urlSite}/bibles/${bibleVersion}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=true&include-verse-numbers=true&include-verse-spans=false`;

    const data = await this.getBasic(URL);
    return data.data;
  }
}

export { ScriptureSite };
