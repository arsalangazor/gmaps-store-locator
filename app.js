const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Store = require('./api/models/store');
const StoreService = require('./api/services/storeService');
const storeService = new StoreService();
const dotEnv = require('dotenv')
dotEnv.config()
const port = 3000



// const noSniff = require('dont-sniff-mimetype')
// app.use(noSniff())

//app.use(express.static(path.join(__dirname, "js")));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('X-Content-Type', '*');
    next();
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster2.2vnbc.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

app.use(express.json({
    limit: '50mb'
}));

app.get('/api/stores', (req, res)=>{
    const zipCode = req.query.zip_code;
    storeService.getStoresNear(zipCode)
    .then((stores)=>{
        res.status(200).send(stores);
    }).catch((error)=>{
        console.log(error);
    })
})

app.post('/api/stores', (req, res)=>{
    const stores = req.body.stores;
    let dbStores = []
    for(const store of stores){
        dbStores.push({
            _id: new mongoose.Types.ObjectId(),
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude
                ]
            }
        })
    }
    Store.create(dbStores, (err, stores)=>{
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(stores);
        }
    })
})

app.delete('/api/stores', (req, res)=> {
    Store.deleteMany({}, (result)=>{
        res.status(200).send(result);
    });
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));