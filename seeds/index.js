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
                  url: 'https://res.cloudinary.com/daprx8wd9/image/upload/v1708680566/Trackmytrek2/wtegdodjvexd1qofpdbd.jpg',
                  filename: 'Trackmytrek2/wtegdodjvexd1qofpdbd',
                },
                {
                  url: 'https://res.cloudinary.com/daprx8wd9/image/upload/v1708680549/Trackmytrek2/qcydspv6o9f9udpbntar.jpg',
                  filename: 'Trackmytrek2/qcydspv6o9f9udpbntar'
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
