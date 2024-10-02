// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  const fileUrl = request.url;
  console.log("Downloading from URL:", fileUrl);
  const filename = request.filename;

  downloadFile(fileUrl);
});

async function downloadFile(fileUrl) {
  const canvasSession = await grabCanvasSession();
  // console.log("canvas_session=" + canvasSession);
  fetch("http://localhost:3000/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: fileUrl, canvasSession: canvasSession }),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) =>
      console.log("File sent to server for download and processing:", data),
    )
    .catch((error) => console.error("Error:", error));
}

async function grabCanvasSession() {
  return new Promise((resolve, reject) => {
    const url = "https://ufl.instructure.com";
    chrome.cookies.getAll({ url: url }, (cookies) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving cookies:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }

      console.log("Cookies retrieved:", cookies);
      if (cookies.length === 0) {
        console.log("No cookies found for this URL.");
        resolve(null); // Resolve with null if no cookies found
        return;
      }

      const canvasSession = cookies.find(
        (cookie) => cookie.name === "canvas_session",
      );
      console.log(canvasSession);
      if (canvasSession) {
        resolve("canvas_session=" + canvasSession.value); // Resolve with the cookie value
      } else {
        resolve(null); // Resolve with null if the cookie is not found
      }
    });
  });
}
