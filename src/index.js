import "./styles/styles.css";
import { NeedBible } from "./NeedBible";

window.addEventListener("DOMContentLoaded", () => {
  const keySrc = document.querySelector("#key-src");
  const paiSrc = document.querySelector("#paid-src");
  const revSrc = document.querySelector("#rev-src");
  const contentSrc = document.querySelector("#content-src");
  const statusSrc = document.querySelector("#status-src");

  const download = document.querySelector(".download");
  download.addEventListener("click", function () {
    const key = keySrc.value;
    const paid = paiSrc.value;
    const revision = revSrc.value;
    const typeContent = contentSrc.value;
    const bibleVersion = `${paid}-${revision}`;

    const needBible = new NeedBible(key, bibleVersion, typeContent, statusSrc);
    needBible.fillGlobal();
  });
});
