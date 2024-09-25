// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  const url = request.url;
  console.log("Downloading from URL:", url);
  const filename = request.filename;
  convertToPDF(filename, "https://ufl.instructure.com");

  // chrome.downloads.download({ url: url, filename: filename }, (downloadId) => {
  //   chrome.downloads.onChanged.addListener((delta) => {
  //     if (delta.id === downloadId && delta.state && delta.state.current === 'complete') {
  //       // Convert the downloaded file to PDF
  //       convertToPDF(filename);
  //     }
  //   });
  // });
});

async function convertToPDF(filename) {
  const apiURL =
    "https://v2.convertapi.com/convert/ppt/to/pdf?Secret=ld4QiUgTnSnbeyQR";
  const formData = new FormData();

  // Prepare file for upload
  //  const file = new File([new Blob()], filename); // Replace Blob with actual file content

  //formData.append("file", url);
  const url = "https://ufl.instructure.com";
  chrome.cookies.getAll({ url: url }, (cookies) => {
    console.log("Cookies retrieved:", cookies);
    if (cookies.length === 0) {
      console.log("No cookies found for this URL.");
    }
    const cookieString = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    console.log("Cookie String:", cookieString);

    fetch(apiURL, {
      method: "POST",
      headers: {
        Cookie: cookieString,
        "Content-Type": "application/json",
      },
      body: formData,
    })
      .then((response) => {
        console.log(response);
      })
      // response.blob())

      .then((blob) => {
        // Download the converted PDF
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
          url: url,
          filename: filename.replace(".pptx", ".pdf"),
        });
      })
      .catch((error) => console.error("Conversion failed:", error));
  });
}
