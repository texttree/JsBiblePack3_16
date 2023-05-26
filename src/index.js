import "./styles/styles.css";

window.addEventListener("DOMContentLoaded", () => {
  const download = document.querySelector(".download");
  download.addEventListener("click", () => {
    const link = document.createElement("a");
    const zipLink =
      "https://app.thedigitalbiblelibrary.org/entry/download_archive?id=d8bb452293f21682&license=30235&revision=1&type=release";
    const zipName = "test.zip";

    link.setAttribute("href", zipLink);
    link.setAttribute("download", zipName);
    link.setAttribute("target", "_blank");

    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
