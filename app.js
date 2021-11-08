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
        res.json("Invalid name of Cryptocurrency!!!!!");
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
        res.json("Invalid Request Found!!!!!!");
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
            console.log(all);
            if(coin!==""){
                list.push(all);
            }
        });

        $(losers).find('tr').each(function(i,elem){
            var rank = $(this).find('td:nth-child(1)').text();
            var coin = $(this).find('td:nth-child(2)').find('.q7nmo0-0.bogImm').text();
            var symbol = $(this).find('.q7nmo0-0.krbrab.coin-item-symbol').text();
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
        console.log(err);
        res.json("Invalid Request Found!!!!!!");
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
        res.json("Invalid Request Found!!!!!!");
        });
});



const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}....`));
