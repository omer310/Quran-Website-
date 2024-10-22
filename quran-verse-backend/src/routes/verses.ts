import express from 'express';
import axios from 'axios';
import Verse from '../models/Verse';

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const reciter = req.query.reciter || 'ar.alafasy';
    // Generate a random ayah number between 1 and 6236 (total number of ayahs in the Quran)
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    
    const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-simple,en.asad,${reciter}`);
    const data = response.data.data[0];
    const verse = new Verse({
      number: data.numberInSurah,
      text: data.text,
      translation: response.data.data[1].text,
      audioUrl: response.data.data[2].audio, // Add audio URL
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
    const reciter = req.query.reciter as string;

    if (reciter) {
      // If a reciter is specified, only fetch and return the audio URL
      const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/editions/${reciter}`);
      const audioUrl = response.data.data[0].audio;
      res.json({ audioUrl });
    } else {
      // If no reciter is specified, return the full verse data
      const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/editions/quran-simple,en.asad,ar.alafasy`);
      const data = response.data.data[0];
      const verse = new Verse({
        number: data.numberInSurah,
        text: data.text,
        translation: response.data.data[1].text,
        audioUrl: response.data.data[2].audio,
        surah: {
          number: data.surah.number,
          name: data.surah.name,
          englishName: data.surah.englishName
        }
      });
      await verse.save();
      res.json(verse);
    }
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

router.get('/reciters', async (req, res) => {
  try {
    const response = await axios.get('https://api.alquran.cloud/v1/edition?format=audio&language=ar');
    const reciters = response.data.data;
    res.json(reciters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reciters', error });
  }
});

export default router;
