const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '65b6aa82c9fdb82a79d82184',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore ab dolorem inventore, perferendis odio, fuga obcaecati labore minima, sequi distinctio nemo eligendi sunt.",
            price: price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dsrylwhzq/image/upload/v1706728680/Yelpcamp2/oucdyp1mvwyxy5bxmn6y.jpg',
                  filename: 'Yelpcamp2/gbuu66hscdlzjtewlgby',
                },
                {
                  url: 'https://res.cloudinary.com/dsrylwhzq/image/upload/v1706697574/Yelpcamp2/k991h1kn9ghaagx7bzs0.jpg',
                  filename: 'Yelpcamp2/k991h1kn9ghaagx7bzs0',
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
