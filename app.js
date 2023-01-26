const fs = require('fs');
const path = require('path');
const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
const authlog = path.join('/var/log/auth.log');
const axios = require('axios');
const os = require("os");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
var countries = require("i18n-iso-countries");
const ms = require("ms")

if (os.platform() !== "linux") return console.log("ATTENTION : Utilisable uniquement sur un OS basé sur debian.")
    
fs.readFile(authlog, 'utf8', (err, data) => {
    if (err) throw err;
    const ips = [];
    data.split('\n').forEach((line) => {
        const matches = line.match(ipRegex);
        if (matches) {
            matches.forEach((match) => {
                if (!ips.includes(match)) {
                    ips.push(match);
                }
            });
        }
    });

    console.log(`${ips.length} ip à inspecter veuillez patienter ...`)
    var start = new Date()
    const results = [];
    (async function () {
        
        var counter = 1
        for (let ip of ips) {
            try {
                const response = await axios.get(`https://api.country.is/${ip}`);
                results.push(countries.getName(JSON.stringify(response.data.country).replace(/"/g, ""), "fr"));
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                var pourcentage = Math.round((counter  * 100 ) / ips.length );
                var progressbar = ''
                var i = 1;
                while(pourcentage / 2 > i) {
                    var progressbar = progressbar + '█'
                    i++
                }
                while(progressbar.length <= 50 ) {
                    var progressbar = progressbar + '='
                }
                process.stdout.write(`[${progressbar}] ${pourcentage}%`); 
                if(counter === ips.length) console.log("")
                counter++
            } catch (err) {
                console.error(err);
            }
        }
        var end = new Date()
        const difftime = (end - start)
        console.log(`Temps écoulé : ${ms(difftime)}`)
        console.log(`Temps moyen  : ${(difftime / 1000) / ips.length} secondes par ip`)

        const count = Array.from(
            results.reduce((r, c) => r.set(c, (r.get(c) || 0) + 1), new Map()), 
            (([nom, count]) => ({ nom, count }))
        )
        count.sort((a, b) => {  
            return a.count <= b.count
              ? 1
              : -1
        })
        
        const names = []
        count.forEach(name => {
            names.push(name.nom)
        })
        const values = []
        count.forEach(name => {
            values.push(name.count)
        })
        const colors = []

        for (const it of count) {
            var o = Math.round, r = Math.random, s = 255;
            colors.push('rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')');
        }
        const data = {
            labels: names,
            datasets: [{
                label: 'Graphique des tentatives de connexion par pays',
                data: values,
                backgroundColor: colors,
            }]
        };
        const config = {
            type: 'bar',
            data: data,
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            },
        };
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ type: 'jpg', width: (100 * count.length), height: 1080, backgroundColour: "white" });
        const buf = await chartJSNodeCanvas.renderToBuffer(config)
        fs.writeFile('graph.jpg', buf, (err) => {
            if (err) throw err;
            console.log("Le graphique à bien été généré");
        });
    })()
});
