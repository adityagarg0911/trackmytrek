const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Trek = require('../models/trek');

mongoose.connect('mongodb://127.0.0.1:27017/trackmytrek');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Trek.deleteMany({});
    for(let i=0; i<70; i++){
        const random360 = Math.floor(Math.random() * 360);
        const price = Math.floor(Math.random() * 1000) + 2000;
        const camp = new Trek({
            author: '65d86724857106aa6bc851c4',
            location: `${cities[random360].state}`,
            title: `${cities[random360].city}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore ab dolorem inventore, perferendis odio, fuga obcaecati labore minima, sequi distinctio nemo eligendi sunt.",
            price: price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random360].longitude, 
                    cities[random360].latitude
                ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dhpoq6jst/image/upload/v1708688123/Trackmytrek2/mthxmo9idljfsznpwh46.jpg',
                  filename: 'Trackmytrek2/mthxmo9idljfsznpwh46',
                },
                {
                  url: 'https://res.cloudinary.com/dhpoq6jst/image/upload/v1708687926/Trackmytrek2/ph39rwrcsksrqnn4moqj.jpg',
                  filename: 'Trackmytrek2/ph39rwrcsksrqnn4moqj'
                }
            ]
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
