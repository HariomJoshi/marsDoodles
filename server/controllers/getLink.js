// const cloudinary = require('cloudinary').v2;

exports.getLink = async (req, res) => {
  try {
    // Get the image data from the request body
    const { imageData } = req.body;
    // Remove the "data:image/png;base64," prefix from the data URL
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    // Create a buffer from the base64 data
    const imageBuffer = Buffer.from(base64Data, "base64");
    // Generate a unique filename 
    const filename = `drawing_${Date.now()}.png`;
    // Specify the path to save the file
    const filePath = path.join(__dirname, "uploads", filename);
    // Save the file to the specified path
    fs.writeFileSync(filePath, imageBuffer);
    // Generate a link to the saved file
    const linkToFile = `/uploads/${filename}`;
    // Respond with the link to the frontend
    res.json({ link: linkToFile });
  } catch (error) {
    console.error("Error saving canvas image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
