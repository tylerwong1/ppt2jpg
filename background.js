// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  const fileUrl = request.url;
  console.log("Downloading from URL:", fileUrl);
  const filename = request.filename;
  //convertToPDF(filename, "https://ufl.instructure.com");
  //
  const cookieString = grabCookies();
  fetch("http://localhost:3000/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieString,
    },
    body: JSON.stringify({ url: fileUrl }),
  })
    .then((response) => response.json())
    .then((data) =>
      console.log("File sent to server for download and processing:", data),
    )
    .catch((error) => console.error("Error:", error));
});

async function grabCookies() {
  let cookieString = "";
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
  });
  return cookieString;
}
