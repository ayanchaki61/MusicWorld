const mongoose = require('mongoose');
require('dotenv').config();

const Music = require('./models/Music');

const updateLanguages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musicworld');
    console.log('MongoDB connected');

    // Update all music tracks without a language or with empty language
    const result = await Music.updateMany(
      { $or: [{ language: null }, { language: '' }, { language: { $exists: false } }] },
      { $set: { language: 'English' } }
    );

    console.log(`Updated ${result.modifiedCount} music tracks with default language "English"`);

    // Show all unique languages
    const languages = await Music.distinct('language');
    console.log('Current languages in database:', languages);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateLanguages();
