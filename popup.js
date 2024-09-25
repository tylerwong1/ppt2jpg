// popup.js
document.getElementById("download-convert").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: downloadAndConvertPPT
  });
});

function downloadAndConvertPPT() {
  const links = document.querySelectorAll('a[download]')
  console.log(links);
  if (links.length === 0) {
    alert("No PowerPoint files found on this page.");
    return;
  }

  links.forEach(link => {
    chrome.runtime.sendMessage({ url: link.href, fileName: link.innerText })
    console.log(link.href);
    console.log(link.innerText);
  });
}

