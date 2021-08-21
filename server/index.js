const sqlite3 = require('sqlite3').verbose();

const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()

const moment = require('moment')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/name/:employee", (req, res) => {

    const employee = req.params.employee;
    console.log(employee)
    let sql = `SELECT * FROM staff WHERE employee == "${employee}"`;
    console.log(sql)
    let db = new sqlite3.Database('./database/tasks.db', (err) => {
        if (err) {
            console.error(err.message);
            db.close()  
            throw err;
        }
        console.log('Connected to the database.');
    });
    
    db.all(sql,[],(err, rows ) => {
        // console.log(rows);
        if (err) {
            console.error(err.message);
            db.close()  
            throw err;
        }
        const employee = rows;
        //res.send(rows);   
        db.all(`SELECT task_description FROM tasks WHERE id == ?`,[employee[0].task_id],(err, rows ) => {
            console.log(rows);
            res.send({employee: employee[0], task: rows[0]});               
        });
            
    });

    db.close()  

});

app.get("/api/analytics", (req, res) => {

    let sql = `SELECT * FROM tasks`;
    let db = new sqlite3.Database('./database/tasks.db', (err) => {
        if (err) {
            console.error(err.message);
            db.close()  
            throw err;
        }
        console.log('Connected to the database.');
        db.all(sql,[],(err, rows ) => {
            // console.log(rows);
            if (err) {
                console.error(err.message);
                db.close()  
                throw err;
            }

            rows.map((row) => {
                //console.log(row.finish_time)
                const s_t = moment(row.start_time);
                const f_t = moment(row.finish_time);
                row.start_time = s_t.format("DD-MM-YYYY HH:mm:ss");
                row.finish_time = f_t.format("DD-MM-YYYY HH:mm:ss");
                row.period = Math.ceil(moment.duration(f_t.diff(s_t)).asMinutes());
            })

            console.log(rows);
            res.send(rows);               
            });    
    });            

    db.close()  

});

app.post('/api/start', (req, res) => {
    const query = req.body.query;
    console.log("****START*********")
    console.log(query)
    //let sql_employee = `UPDATE staff SET active = 1 WHERE id == ?`;
    var t_id = 0;
    let sql_insertion = `INSERT INTO tasks (employee_name, task_description, start_time) VALUES (?, ? , ?)`;
    let sql_updated_res = `SELECT * FROM staff WHERE id == "${query.id}"`;

    let db = new sqlite3.Database('./database/tasks.db', (err) => {
        if (err) {
            console.error(err.message);
            db.close()  
            throw err;
        }
        console.log('Connected to the database.');
    });

    db.run(sql_insertion, [query.name, query.task, moment().utcOffset('+0600')], function(err, rows) {
        if (err) {
            console.error(err.message);
            db.close()  
            throw err;
        }
        t_id = this.lastID;
        console.log("Inserted ID: " + t_id);

        db.run(`UPDATE staff SET active = 1, task_id = ? WHERE id == ?`, [t_id, query.id], function(err){
            if (err) {
                console.error(err.message);
                db.close()  
                throw err;
            }

                db.all(sql_updated_res,[],(err, rows) => {
                    if (err) {
                        console.error(err.message);
                        db.close()  
                        throw err;
                    }
                    res.send(rows);         
                });
            });
    
    });

    db.close()  

});
    
app.post('/api/stop', (req, res) => {
    const query = req.body.query;
    console.log("****STOP*********")
    console.log(query)

    let sql_employee = `UPDATE staff SET active = 0 WHERE id == ?`;
    let sql_update = `UPDATE tasks SET finish_time = ? WHERE id == ?`;
    let sql_updated_res = `SELECT * FROM staff WHERE id == "${query.id}"`;

    let db = new sqlite3.Database('./database/tasks.db', (err) => {
        if (err) {
            console.error(err.message);
            db.close()  
            throw err;
        }
        console.log('Connected to the database.');
    });

    db.run(sql_update, [moment().utcOffset('+0600'), query.task_id], function(err) {
        if (err) {
            console.error(err.message);
            db.close()  
            throw err;
        }
        
        db.run(sql_employee, query.id, function(err){
            if (err) {
                console.error(err.message);
                db.close()  
                throw err;
            }
            
            db.all(sql_updated_res,[],(err, rows) => {
                if (err) {
                    console.error(err.message);
                    db.close()  
                    throw err;
                }
                res.send(rows);         
            });
        });
    });



    db.close()  
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});