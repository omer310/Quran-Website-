import express from 'express';
import axios from 'axios';
import Verse from '../models/Verse';

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    // Generate a random ayah number between 1 and 6236 (total number of ayahs in the Quran)
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    
    const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-simple,en.asad`);
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

router.get('/:surahNumber/:verseNumber', async (req, res) => {
  try {
    const { surahNumber, verseNumber } = req.params;
    const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/editions/quran-simple,en.asad`);
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
