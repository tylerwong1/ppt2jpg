const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const cookies = env.cookie;

// Function to download the file from a given URL
async function downloadFile(fileUrl) {
  const filePath = path.resolve(__dirname, "downloads", "file.ppt");
  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "arraybuffer",
    headers: {
      Cookie: cookies,
    },
  });

  // Log the response headers
  console.log("Response Headers:", response.headers);

  const fileBuffer = Buffer.from(response.data);

  // Save the file to disk (change the filename as necessary)
  fs.writeFileSync("downloaded_file.pptx", fileBuffer);
  console.log("File downloaded successfully");

  // if (!response.headers["content-type"].includes("application/vnd")) {
  //   console.error(
  //     "Expected a PowerPoint file but received:",
  //     response.headers["content-type"],
  //   );
  //   return;
  // }

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// API endpoint to trigger the file download
app.post("/download", async (req, res) => {
  const { url } = req.body; // Expect the file URL in the request body

  try {
    await downloadFile(url);
    res.json({ status: "success", message: "File downloaded successfully" });
  } catch (error) {
    console.error("Error downloading file:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to download file" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
