import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;
const apiKey = process.env.API_KEY;

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const apiUrl = 'https://api.um.warszawa.pl/api/action/public_transport_routes/?apikey=' + apiKey;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    console.error('API request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/dictionary', async (req, res) => {
  try {
    const apiUrl = 'https://api.um.warszawa.pl/api/action/public_transport_dictionary/?apikey=' + apiKey;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
    
  } catch (error) {
    console.error('API request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stops', async (req, res) => {
  try {
    const apiUrl = 'https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&apikey=' + apiKey;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
    
  } catch (error) {
    console.error('API request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
