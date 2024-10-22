import mongoose from 'mongoose';

const VerseSchema = new mongoose.Schema({
  number: Number,
  text: String,
  translation: String,
  audioUrl: String, // Add this line
  surah: {
    number: Number,
    name: String,
    englishName: String
  },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Verse', VerseSchema);
