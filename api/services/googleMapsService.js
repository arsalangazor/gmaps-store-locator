const axios = require('axios').default;

const googleMapsURL = 'https://maps.googleapis.com/maps/api/geocode/json';

class GoogleMaps {
    async getCoordinates(zipCode) {
        let coordinates = [];
        await axios.get(googleMapsURL, {
            params: {
                address: zipCode,
                key: ""
            }
        }).then((response)=>{
            const data = response.data;
            coordinates = [
                data.results[0].geometry.location.lng,
                data.results[0].geometry.location.lat
            ]
        }).catch((error)=>{
            throw Error(error);
        })
        
        return coordinates;
    }
}

module.exports = GoogleMaps;