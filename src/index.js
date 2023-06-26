import "./styles/styles.css";
import { NeedBible } from "./NeedBible";

window.addEventListener("DOMContentLoaded", () => {
  const urlSrc = document.querySelector("#url-src");
  const keySrc = document.querySelector("#key-src");
  const paiSrc = document.querySelector("#paid-src");
  const revSrc = document.querySelector("#rev-src");
  const contentSrc = document.querySelector("#content-src");
  const statusSrc = document.querySelector("#status-src");

  if (urlSrc.value === "" && localStorage.urlSite !== undefined) {
    urlSrc.value = localStorage.urlSite;
  }
  if (keySrc.value === "" && localStorage.apiKey !== undefined) {
    keySrc.value = localStorage.apiKey;
  }

  const download = document.querySelector(".download");
  download.addEventListener("click", function () {
    const paid = paiSrc.value;
    const revision = revSrc.value;
    const typeContent = contentSrc.value;
    const bibleVersion = `${paid}-${revision}`;
    localStorage.urlSite = urlSrc.value;
    localStorage.apiKey = keySrc.value;

    const needBible = new NeedBible(bibleVersion, typeContent, statusSrc);
    needBible.fillGlobal();
  });
});
