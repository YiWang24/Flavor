// Load environment variables unless in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Menu = require("../models/menu");
const Image = require("../models/image");
const Type = require("../models/type");
const menus = require("./menus");
const images = require("./images");
const types = require("./types");
const dbUrl = process.env.DB_URL;

const seedDB = async () => {
  try {
    // Connect to Database
    await mongoose.connect(dbUrl);
    console.log("Connected to database");

    // Clear all data
    // await Menu.deleteMany({});
    await Image.deleteMany({});
    await Type.deleteMany({});
    console.log("Cleared All collection");

    // Insert into images
    const savedImage = await Promise.all(
      images.map((img) => new Image(img).save())
    );
    console.log("Inserted images");
    //Insert into types

    const savedType = await Promise.all(
      types.map(async (type) => {
        // Find the image corresponding to the typeName
        const associatedImages = savedImage
          .filter((img) => img.imageName === type.typeName)
          .map((img) => img._id);

        return await new Type({
          ...type,
          author: "Yi Wang",
          images: associatedImages, // Ensure images is an array
        }).save();
      })
    );

    console.log("Inserted types");
    // Insert into menu
    await Promise.all(
      menus.map(async (menu) => {
        // Pick a random type from savedType
        const randomType =
          savedType[Math.floor(Math.random() * savedType.length)];
        // Create and save the Menu object
        await new Menu({
          ...menu,
          author: new mongoose.Types.ObjectId("66e8eed2f0905aa56fb7d7e8"),
          images: savedImage.map((img) => img._id),
          type: randomType._id,
        }).save();
      })
    );

    console.log("Inserted menus");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run seedDb
seedDB();
