import express from 'express';
import axios from 'axios';
import Verse from '../models/Verse';

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const response = await axios.get('https://api.alquran.cloud/v1/ayah/random/editions/quran-simple,en.asad');
    const data = response.data.data[0];
    const verse = new Verse({
      number: data.numberInSurah,
      text: data.text,
      translation: response.data.data[1].text,
      surah: {
        number: data.surah.number,
        name: data.surah.name,
        englishName: data.surah.englishName
      }
    });
    await verse.save();
    res.json(verse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verse', error });
  }
});

router.get('/history', async (req, res) => {
  try {
    const verses = await Verse.find().sort({ date: -1 }).limit(30);
    res.json(verses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verse history', error });
  }
});

export default router;