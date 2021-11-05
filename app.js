const express = require('express');
const app = express();
const axios = require('axios');
const cherrio = require('cheerio');

app.get('/', (req,res)=>{
    res.json({
        "message":"Welcome to the CryptoAPI API"
    });
});

app.get('/currency/:coin' , (req,res)=>{
    axios.get('https://coinmarketcap.com/currencies/'+req.params.coin+'/')
    .then((response)=>{
        const html = response.data;
        const $ = cherrio.load(html);
        var rank = $('.namePillPrimary').text();
        rank = rank.slice(5,rank.length);
        const price = $('.priceValue').text();
        const symbol = $('.nameSymbol').text();
        const highlow24hr = $('.n78udj-5.dBJPYV').text().split('$');;
        const low = '$'+highlow24hr[1];
        const high = '$'+highlow24hr[2];
        const maxsupply = [];
        $('.maxSupplyValue').each((i,el)=>{
                var supply = $(el).text();
                maxsupply.push(supply);
        });
      
        const list = [];
        $('.statsValue').each(function(i,elem){
            const stats = $(this).text();
            list.push(stats);
        });
        const marketcap = list[0];
        const fullydilutedmc = list[1];
        const volume = list[2];
        const volumemc = list[3];
        const circulating = list[4];

        res.json({
            "Coin":req.params.coin,
            "Price":price,
            "Rank":rank,
            "Symbol":symbol,
            "Market Cap":marketcap,
            "Fully Diluted Market Cap":fullydilutedmc,
            "Volume 24hr":volume,
            "Volume/Market Cap":volumemc,
            "Circulating Supply":circulating,
            "High/Low 24hr":{
                "High":high,
                "Low":low
            },
            "Max Supply":maxsupply[0],
            "Total Supply":maxsupply[1]

        });
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
    
});


app.get('/top-currency/',(req,res)=>{
    axios.get('https://crypto.com/price?page=1')
    .then((response)=>{
        const html = response.data;
        const $ = cherrio.load(html);
        const list = [];
        $('.chakra-text.css-1mrk1dy').each(function(i,elem){
            var coin = $(this).text();
            coin = coin.replace(" ","-");
            coin = coin.replace(".","-");
            list.push(coin);
        });
        res.json({
            "Top 50 Cryptocurrencies":list
        });
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
});

app.get("/news",(req,res)=>{
    axios.get('https://news.bitcoin.com/')
    .then((response)=>{
        const html = response.data;
        const $ = cherrio.load(html);
        const list = [];
        $('.story--medium__info').each(function(i,elem){
            var news_title = $(this).text();
            var news_url = $(this).find('a').attr('href');
            list.push({
                "Title":news_title,
                "URL":news_url
            });
        });
        res.json({
            "News":list
        });
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
});



const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}....`));
