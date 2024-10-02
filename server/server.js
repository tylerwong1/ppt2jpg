const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// const cookies = env.cookie;

// Function to download the file from a given URL
async function downloadFile(fileUrl, canvasSession) {
  const filePath = path.resolve(__dirname, "downloads");
  // console.log(canvasSession);
  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "arraybuffer",
    headers: {
      Cookie: canvasSession,
    },
  });

  // Log the response headers
  const contentDisposition = response.headers.get("content-disposition");
  const fileName = getFileName(contentDisposition);

  const fileBuffer = Buffer.from(response.data);

  // Save the file to disk (change the filename as necessary)
  fs.writeFileSync(filePath + "/" + fileName, fileBuffer);
  console.log("File downloaded successfully");

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// API endpoint to trigger the file download
app.post("/download", async (req, res) => {
  const { url, canvasSession } = req.body; // Expect the file URL in the request body
  // const headers = req.get("cookie");
  // console.log(url);
  // console.log(req.body);
  try {
    await downloadFile(url, canvasSession);
    res.json({ status: "success", message: "File downloaded successfully" });
  } catch (error) {
    console.error("Error downloading file:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to download file" });
  }
});

function getFileName(contentDisposition) {
  if (!contentDisposition) {
    return null; // Return null if the header is not provided
  }

  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/; // Regex to match filename
  const matches = filenameRegex.exec(contentDisposition);

  if (matches && matches[1]) {
    return matches[1].replace(/['"]/g, ""); // Remove any quotes around the filename
  }

  return null; // Return null if no filename is found
}

function convertoPDF() {}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
