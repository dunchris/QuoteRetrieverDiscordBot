const scraper = require('table-scraper');
const months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
//'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';

function quote_today(url, callback) {
    
    scraper
    .get(url)
    .then(function(tableData) {  
        let i = 0;
        let h = 0;
        let valFound = false
        for (h; h < tableData.length; h++)
        {   
            
            let tbl = tableData[h];
            i = 0;
            while (i < tbl.length)
            {
                if ('1' in tbl[i])
                {
                    console.log("KEY EXISTS");
                    if (tbl[i]['1'] !== '')
                    {
                        console.log("VALUE EXISTS");
                        
                        valFound = true
                        break;
                    }
                }
                i++;
                
            }
            if (valFound)
                break;
        }
        
        if (h >= tableData.length)
        {
            quote = "No quote for today, sorry.";
        }
        else
        {
            var first_two_quotes = String(tableData[h][i]['1']).split(/[\n|]+/,40);
            first_two_quotes = first_two_quotes.filter(value => /\S+/.test(value));
            var d = new Date();
            var reg = new RegExp(".*" + months[d.getMonth()] + " *0*" + d.getDate().toString() + ".* " + d.getFullYear().toString() + ".*");
            //console.log(first_two_quotes);
            const match = first_two_quotes.find(value => reg.test(value));
            const ind = first_two_quotes.indexOf(match);
            if (ind < 0)
                quote = "No quote for today.";
            else
                quote = match + "\n\n\"" + first_two_quotes[ind+1].trim() + "\"\n\n-- *" + first_two_quotes[ind+2].trim() + "*";
        }
        callback(quote);
    });

}
module.exports = {quote_today};