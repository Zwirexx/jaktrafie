import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;
const apiKey = process.env.API_KEY;

app.use(express.json());

async function getApiDataFromFile(filename, api) {
  const today = new Date().toISOString().split("T")[0];
  // if file exists, read data from it, otherwise create it
  const directory = path.join("src", "lib", "api");
  const filePath = path.join(directory, `${filename}_${today}.json`);
  if (fs.existsSync(filePath)) {
    // delete old files
    fs.readdirSync(directory).forEach((file) => {
      const deletePath = path.join(directory, file);
      if (file.includes(filename) && !file.includes(today)) {
        fs.unlinkSync(deletePath); // Usuń plik
      }
    });
    // read file content
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } else {
    // create file with api content
    try {
      const response = await fetch(api);
      const data = await response.json();

      if (data) {
        const jsonData = JSON.stringify(data);
        await fs.promises.writeFile(filePath, jsonData, "utf8");
      } else {
        console.error("Brak danych z API lub niepoprawna odpowiedź.");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych z API:", error);
    }
  }
}

app.get("/api/data", async (req, res) => {
  try {
    const apiUrl =
      "https://api.um.warszawa.pl/api/action/public_transport_routes/?apikey=" +
      apiKey;
    const data = await getApiDataFromFile("wtp_routes", apiUrl);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (error) {
    console.error("API request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/dictionary", async (req, res) => {
  try {
    const apiUrl =
      "https://api.um.warszawa.pl/api/action/public_transport_dictionary/?apikey=" +
      apiKey;
    const data = await getApiDataFromFile("wtp_dictionary", apiUrl);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (error) {
    console.error("API request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/stops", async (req, res) => {
  try {
    const apiUrl =
      "https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&apikey=" +
      apiKey;

    const data = await getApiDataFromFile("wtp_stops", apiUrl);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (error) {
    console.error("API request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
