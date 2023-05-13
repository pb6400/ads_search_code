const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
const env = require("../server/.env")

const port = 8000;
const pass = process.env.MONGO_PASSWORD
// Connecting to MongoDB Atlas
mongoose.connect('mongodb+srv://Easyhaiba01:${pass}@cluster0.df6lr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const companySchema = new mongoose.Schema({
  _id: String,
  company_name: String,
  link: String
});

const adSchema = new mongoose.Schema({
  company_id: String,
  primary_text: String,
  headline: String,
  description: String,
  CTA:String,
  imageUrl: String,
});

const Company = mongoose.model('Company', companySchema);
const Ad = mongoose.model('Ad', adSchema);


app.get('/api/search', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    // console.log(keyword)
    const ads = await Ad.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'company_id',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: '$company',
      },
      {
        $match: {
          $or: [
            { 'company.company_name': { $regex: keyword, $options: 'i' } },
            { primary_text: { $regex: keyword, $options: 'i' } },
            { headline: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          company_name: '$company.company_name',
          primary_text: 1,
          headline: 1,
          description: 1,
          imageUrl: 1,
          link:1,
          CTA:1
        },
      },
    ]);
    // console.log("ads from db:",ads)
    res.send(ads);
  } catch (error) {
    console.error('Error searching ads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
