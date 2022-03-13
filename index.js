const express = require('express');
const app = express();
const axios = require('axios');
const cherrio = require('cheerio');

app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to the CryptoAPI API"
    });
});

//functions 

async function get_coin_details(list) {
    var coin_details = [];
    return await axios.all(list.map(url => axios.get(url))).then((data)=>{
        data.forEach(res => {
            const html = res.data;
                    const $ = cherrio.load(html);
                    const symbol = $('.nameSymbol').text();
                    var coin_detail = $('.nameSymbol').remove();
                    var coin = $('.sc-1q9q90x-0.jCInrl.h1').text();
                    var rank = $('.namePillPrimary').text();
                    rank = rank.slice(5, rank.length);
                    const price = $('.priceValue').text();
                    
                    const highlow24hr = $('.n78udj-5.dBJPYV').text().split('$');
                    const image = $('.sc-16r8icm-0.gpRPnR.nameHeader').find('img').attr('src');
                    const link = $('.link-button').attr('href');
                    const low = '$' + highlow24hr[1];
                    const high = '$' + highlow24hr[2];
                    const maxsupply = [];
                    $('.maxSupplyValue').each((i, el) => {
                        var supply = $(el).text();
                        maxsupply.push(supply);
                    });
        
                    const list = [];
                    $('.statsValue').each(function (i, elem) {
                        const stats = $(this).text();
                        list.push(stats);
                    });
                    const marketcap = list[0];
                    const fullydilutedmc = list[1];
                    const volume = list[2];
                    const volumemc = list[3];
                    const circulating = list[4];
                    coin_details.push( {
                        "Coin":  coin,
                        "Price": price,
                        "Rank": rank,
                        "Symbol": symbol,
                        "Image": image,
                        "Link": link,
                        "Market Cap": marketcap,
                        "Fully Diluted Market Cap": fullydilutedmc,
                        "Volume 24hr": volume,
                        "Volume/Market Cap": volumemc,
                        "Circulating Supply": circulating,
                        "High/Low 24hr": {
                            "High": high,
                            "Low": low
                        },
                        "Max Supply": maxsupply[0],
                        "Total Supply": maxsupply[1]
        
                    });
        });
        return coin_details;
    })
}

async function top_names(list) {
    var top_names = [];
    return await axios.all(list.map(url => axios.get(url))).then((data)=>{
        data.forEach(res => {
        const html = res.data;
        const $ = cherrio.load(html);
        const list = [];
        $('.chakra-text.css-1mrk1dy').each(function(i,elem){
            var coin = $(this).text();
            coin = coin.replace(" ","-");
            coin = coin.replace(".","-");
            top_names.push(coin);
        });
    });
        return top_names;
    })
}


async function more_news() {
    return await axios.get('https://www.coindesk.com/markets/')
        .then((response) => {
            const html = response.data;
            const $ = cherrio.load(html);
            // console.log($('.typography__StyledTypography-owin6q-0').text());
            const list = [];
            $('.article-cardstyles__AcTitle-q1x8lc-1.bwXBTf').each(function (i, elem) {
                var news_title = $(this).text();
                //console.log(news_title);
                var news_url = "https://www.coindesk.com".concat($(this).find('a').attr('href'));
                list.push({
                    "Title": news_title,
                    "URL": news_url,
                });
            });
            return list;
        }).catch((err) => {
            return -1;
        });
}



async function get_news() {
    return await axios.get('https://rapi.cryptonews.com/api/tagdata/crypto-2022/1')
        .then((response) => {
            var html = JSON.stringify(response.data.items);
            html = html.replace(/\\/g, "");
            const $ = cherrio.load(html);
            const list = [];
            $('.mb-30').each(function (i, elem) {
                var news_title = $(this).find('h4').text();
                var news_url = "https://cryptonews.com".concat($(this).find('a').attr('href'));
                list.push({
                    "Title": news_title,
                    "URL": news_url,
                });
            });
            return list;
        }).catch((err) => {
            return -1;
        });
}




// All endpoints
/*  Get coins details : /currency/:coin
    Get multiple coin details : /multiplecoins/:coin
    Get list of top 100 coins : /top-currency/names
    Get list of top 50 coins : /top-currency/top_50_names
    Get details of top 50 coins : /top-currency/top_50_details
    Get details of top 100 coins : /top-currency/details
    Get top-gainers losers details : /top-gainers-losers/
    Get news : /news
*/

app.get('/currency/:coin', (req, res) => {
    axios.get('https://coinmarketcap.com/currencies/' + req.params.coin + '/')
        .then((response) => {
            const html = response.data;
            const $ = cherrio.load(html);
            var rank = $('.namePillPrimary').text();
            
            rank = rank.slice(5, rank.length);
            const price = $('.priceValue').text();
            const symbol = $('.nameSymbol').text();
            const highlow24hr = $('.n78udj-5.dBJPYV').text().split('$');
            const image = $('.sc-16r8icm-0.gpRPnR.nameHeader').find('img').attr('src');
            const link = $('.link-button').attr('href');
            const low = '$' + highlow24hr[1];
            const high = '$' + highlow24hr[2];
            const maxsupply = [];
            $('.maxSupplyValue').each((i, el) => {
                var supply = $(el).text();
                maxsupply.push(supply);
            });

            const list = [];
            $('.statsValue').each(function (i, elem) {
                const stats = $(this).text();
                list.push(stats);
            });
            const marketcap = list[0];
            const fullydilutedmc = list[1];
            const volume = list[2];
            const volumemc = list[3];
            const circulating = list[4];

            res.json({
                "Coin": req.params.coin,
                "Price": price,
                "Rank": rank,
                "Symbol": symbol,
                "Image": image,
                "Link": link,
                "Market Cap": marketcap,
                "Fully Diluted Market Cap": fullydilutedmc,
                "Volume 24hr": volume,
                "Volume/Market Cap": volumemc,
                "Circulating Supply": circulating,
                "High/Low 24hr": {
                    "High": high,
                    "Low": low
                },
                "Max Supply": maxsupply[0],
                "Total Supply": maxsupply[1]

            });
        }).catch((err) => {
            res.json("Invalid name of Cryptocurrency!!!!!");
        });

});

app.get('/multiplecoins/:coin',(req,res)=>{
    const coin_names = req.params.coin.split(',');
    var coin_urls = [];
    coin_names.forEach(name => {
        coin_urls.push('https://coinmarketcap.com/currencies/' + name + '/');
    });
    
    get_coin_details(coin_urls).then((data)=>{
        res.json({
            "Cryptocurrencies": data
        });
    }).catch((err) => {
        res.json("One or more invalid coin name provided!!!!!");
    });
});



app.get('/top-currency/names',(req,res)=>{
    var list = ['https://crypto.com/price?page=1','https://crypto.com/price?page=2'];
    top_names(list).then((data)=>{
        res.json({
            "Top 100 Cryptocurrencies":data
        });
    }).catch((err) => {
        res.json("Under maintainance!!!!!");
    });
});

app.get('/top-currency/top_50_names',(req,res)=>{
    var list = ['https://crypto.com/price?page=1'];
    top_names(list).then((data)=>{
        res.json({
            "Top 50 Cryptocurrencies":data
        });
    }).catch((err) => {
        res.json("Under maintainance!!!!!");
    });
});


app.get('/top-currency/top_50_details', (req, res) => {
    axios.get('https://coinmarketcap.com/coins/')
        .then((response) => {
            const html = response.data;
            const $ = cherrio.load(html);
            var list = [];
            $('tbody').find('tr').each(function (i, elem) {
                var url = $(this).find('a.cmc-link').attr('href');
                list.push("https://coinmarketcap.com" + url);
            });
            list = list.splice(0,50);
            get_coin_details(list).then((data)=>{
                res.json({
                    "Top 50 Cryptocurrencies": data
                });
            });
            
        }).catch((err) => {
            res.json("Under maintainance!!!!!");
        });
});

app.get('/top-currency/details', (req, res) => {
    axios.get('https://coinmarketcap.com/coins/')
        .then((response) => {
            const html = response.data;
            const $ = cherrio.load(html);
            var list = [];
            $('tbody').find('tr').each(function (i, elem) {
                var url = $(this).find('a.cmc-link').attr('href');
                list.push("https://coinmarketcap.com" + url);
            });
             //console.log(list);
            get_coin_details(list).then((data)=>{
                res.json({
                    "Top 100 Cryptocurrencies": data
                });
            });
            
        }).catch((err) => {
            res.json("Under maintainance!!!!!");
        });
});

app.get('/top-gainers-losers/',(req,res)=>{
    axios.get('https://coinmarketcap.com/gainers-losers/')
    .then((response)=>{
        const html = response.data;
        const $ = cherrio.load(html);
        var list = [];
        var list2 = [];
        const gainers_losers = $('.uikit-col-md-8.uikit-col-sm-16');
        var gainers = gainers_losers[0];
        var losers = gainers_losers[1];
        //console.log($(gainers).text(),$(losers).text());
        $(gainers).find('tr').each(function(i,elem){
            var rank = $(this).find('td:nth-child(1)').text();
            var coin = $(this).find('td:nth-child(2)').find('p:nth-child(1)').text();
            var symbol = $(this).find('td:nth-child(2)').find('p:nth-child(2)').text();
            var price = $(this).find('td:nth-child(3)').text();
            var change_24hr = $(this).find('td:nth-child(4)').text();
            var volume_24hr = $(this).find('td:nth-child(5)').text();
            coin = coin.replace(" ","-");
            coin = coin.replace(".","-");
            const all = {
                "Rank":rank,
                "Coin":coin,
                "Symbol":symbol,
                "Price":price,
                "Rise 24hr":change_24hr,
                "Volume 24hr":volume_24hr
            };
            if(coin!==""){
                list.push(all);
            }
        });

        $(losers).find('tr').each(function(i,elem){
            var rank = $(this).find('td:nth-child(1)').text();
            var coin = $(this).find('td:nth-child(2)').find('p:nth-child(1)').text();
            var symbol = $(this).find('td:nth-child(2)').find('p:nth-child(2)').text();
            var price = $(this).find('td:nth-child(3)').text();
            var change_24hr = $(this).find('td:nth-child(4)').text();
            var volume_24hr = $(this).find('td:nth-child(5)').text();
            coin = coin.replace(" ","-");
            coin = coin.replace(".","-");
            const all = {
                "Rank":rank,
                "Coin":coin,
                "Symbol":symbol,
                "Price":price,
                "Drop 24hr":change_24hr,
                "Volume 24hr":volume_24hr
            };
            if(coin!==""){
                list2.push(all);
            }
        });
        res.json({
            "Top Gainers":list,
            "Top Losers":list2
        });
    }).catch((err)=>{
        res.json("Under Maintenance!!!!!!");
    });
});

app.get("/news", (req, res) => {
    axios.get('https://news.bitcoin.com/')
        .then((response) => {
            const html = response.data;
            const $ = cherrio.load(html);
            var list = [];
            $('.story--medium__info').each(function (i, elem) {
                var news_title = $(this).text();
                var news_url = $(this).find('a').attr('href');
                list.push({
                    "Title": news_title,
                    "URL": news_url
                });
            });
            more_news().then((data) => {
                const news = list.concat(data);
                get_news().then((more_data) => {
                    const news2 = news.concat(more_data);
                    res.json({
                        "News": news2
                    });
                });
            });
        }).catch((err) => {
            res.json("Under maintainance!!!!!");
        });
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));
