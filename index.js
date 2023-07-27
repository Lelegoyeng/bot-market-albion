const axios = require('axios');
const express = require('express');
const app = express();
const port = 3999;
const array = require('./itemlist')


let interval
let i = 0

const itemList = array.map((e) => {
    return e.nama;
});
const itemNama = array.map((e) => {
    return e.value;
});

const getItems = async () => {
    axios.get(`https://west.albion-online-data.com/api/v2/stats/prices/${itemList[i]}.json?locations=caerleon,blackmarket&qualities=0`)
        .then(response => {
            const data = response?.data;
            const filters = data?.filter(f =>
                f.sell_price_min > 0 &&
                f.sell_price_max > 0 &&
                f.buy_price_min > 0 &&
                f.buy_price_max > 0
            )
            const filteredData = filters.filter((item, index) => {
                return filters.some((otherItem, otherIndex) => {
                    return otherIndex !== index && otherItem.quality === item.quality;
                });
            });
            const caerleon = filteredData?.filter(f => f.city === 'Caerleon');
            const blackmarket = filteredData?.filter(f => f.city === 'Black Market');

            const caerleonIncludeTax = caerleon?.map(get => {
                return {
                    ...get,
                    sell_price_min: get?.sell_price_min + parseInt(get?.sell_price_min * 0.09)
                }
            })
            if (blackmarket?.buy_price_min > caerleonIncludeTax?.sell_price_min) {
                console.log(caerleonIncludeTax);
            }
            i = i + 1
            console.log(i)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

setInterval(getItems, 1000);

//https://west.albion-online-data.com/api/v2/stats/prices/T4_BAG.json?locations=Caerleon,BLACKMARKET&qualities=0    
// app.get('/api', (req, res) => {
//     axios.get('https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json')
//         .then(response => {
//             const data = response?.data;
//             res.json(data);
//             console.log(data['UniqueName'])
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             res.status(500).json({ error: 'Something went wrong' });
//         });
// });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
