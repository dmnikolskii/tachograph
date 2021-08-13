const sqlite3 = require('sqlite3').verbose();

const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the database.');
});

app.get("/", (req, res) => {
    res.send('hi');
    console.log(req);
});

app.post('/api/fetch_links', (req, res) => {

    const country = req.body.country;
    const city = req.body.city;
    const line = req.body.line;
    const pageid = req.body.pageid;
    
    let sql = `SELECT * FROM twin_links WHERE pageid == ${pageid} AND 
                                                country = '${country}' AND 
                                                plant = '${city}' AND 
                                                line = '${line}';`;

    console.log(req.body);
    
    db.all(sql,[],(err, rows ) => {
        // console.log(err);   
        console.log(rows);
        //res.send("Hi");   
        res.send(rows);   
        
    });
    //db.close()    
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});