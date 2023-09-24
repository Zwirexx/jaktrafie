import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const apiUrl = 'https://api.um.warszawa.pl/api/action/public_transport_routes/?apikey=558910cd-f086-4a9f-a7d0-d7b4048a9e83';
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
    const apiUrl = 'https://api.um.warszawa.pl/api/action/public_transport_dictionary/?apikey=558910cd-f086-4a9f-a7d0-d7b4048a9e83';
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
