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
                    if (tbl[i]['1'] !== '')
                    {
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
            console.log(first_two_quotes)
            var d = new Date();
            let day = d.getDate();
            //8 hr diff
            const hr_diff = 8
            //if the day is one day ahead of america, then subtract one from the day
            if (day - hr_diff < 0)
                day -= 1;

            var reg = new RegExp(".*" + months[d.getMonth()] + ".*" + day.toString() + ".* " + d.getFullYear().toString() + ".*");
            console.log(d.getHours())
            const match = first_two_quotes.find(value => reg.test(value));
            const ind = first_two_quotes.indexOf(match);
            if (ind < 0)
                quote = "No quote for " + months[d.getMonth()] + " " + d.getDate().toString() + " " + d.getFullYear().toString() + " yet.\n"
                        + "Check back later.";
            else
                quote = match + "\n\n\"" + first_two_quotes[ind+1].trim() + "\"\n\n-- *" + first_two_quotes[ind+2].trim() + "*";
        }
        callback(quote);
    });

}
module.exports = {quote_today};