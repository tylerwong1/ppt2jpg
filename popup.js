// popup.js
document
  .getElementById("download-convert")
  .addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: downloadAndConvertPPT,
    });
  });

function downloadAndConvertPPT() {
  const links = document.querySelectorAll("a[href]");

  const pptLinks = Array.from(links).filter((link) =>
    link.href.includes("download_frd=1"),
  );

  const cookies = document.cookie;

  // chrome.cookies.getAll(
  //   {
  //     domain: "https://ufl.instructure.com",
  //     session: True,
  //   },
  //   function (cookies) {
  //     if (cookies) {
  //       console.log("Cookies retrieved:", cookies);
  //     } else {
  //       console.error("unable to get cookies");
  //     }
  //   },
  // );
  console.log(links);
  console.log(pptLinks);
  if (links.length === 0) {
    alert("No PowerPoint files found on this page.");
    return;
  }

  pptLinks.forEach((link) => {
    chrome.runtime.sendMessage({ url: link.href, fileName: link.innerText });
    console.log(link.href);
    console.log(link.innerText);
  });
}
