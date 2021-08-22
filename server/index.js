const sqlite3 = require('sqlite3').verbose();

const express = require('express')
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');
const app = express()

const moment = require('moment')
const xl = require('excel4node');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('/home/tachxoix/public_html'));

var excelData = [];



app.get("/name/:employee", (req, res) => {

    const employee = req.params.employee;
    console.log(employee)

    if (employee.length < 5) return;

    let sql = `SELECT * FROM staff WHERE employee == ?`;
    
    try {
        let db = new sqlite3.Database('./database/tasks.db', (err) => {
            if (err) {
                console.error(err.message);
                db.close()  
                throw err;
            }
            console.log('Connected to the database.');
        });
        
        db.all(sql,[employee],(err, rows ) => {
            // console.log(rows);
            if (err) {
                console.error(err.message);
                db.close()  
                throw err;
            }
            const employee = rows;
            //res.send(rows);   
            db.all(`SELECT task_description FROM tasks WHERE id == ?`,[employee[0].task_id],(err, rows ) => {
                //console.log(rows);
                res.send({employee: employee[0], task: rows[0]});               
            });
                
        });
        db.close() 
    } 
    catch(err) {
        console.log(err)
    }
});

app.get("/api/getexcel", (req, res) => {
    if (!excelData) return;

    try {
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet("Time Sheet");

        var regular = wb.createStyle({
            font: {
                color: "#000000",
                size: 10,
            }
        });
    
        var bold = wb.createStyle({
            font: {
                bold: true,
                color: "#000000",
                size: 10,
            }
        });

        ws.cell(1, 1).string("Имя сотрудника").style(bold);
        ws.cell(1, 2).string("Описание работы").style(bold);
        ws.cell(1, 3).string("Дата начала").style(bold);
        ws.cell(1, 4).string("Время начала").style(bold);
        ws.cell(1, 5).string("Дата окончания").style(bold);
        ws.cell(1, 6).string("Время окончания").style(bold);
        ws.cell(1, 7).string("Длительность(мин.)").style(bold);
        ws.cell(1, 8).string("Статус").style(bold);

            console.log("+++++++++EEXCEL+++++++++")            
            console.log(excelData)
            console.log("/////+++++++++EEXCEL+++++++++")

        let row_n = 2;
        excelData.map((item) => {
            ws.cell(row_n, 1).string(item.employee_name).style(regular);
            ws.cell(row_n, 2).string(item.task_description).style(regular);
            ws.cell(row_n, 3).string(item.start_date).style(regular);
            ws.cell(row_n, 4).string(item.start_time).style(regular);
            ws.cell(row_n, 5).string(item.finish_date).style(regular);
            ws.cell(row_n, 6).string(item.finish_time).style(regular);
            ws.cell(row_n, 7).number(item.period).style(regular);
            //console.log(item.period)
            ws.cell(row_n, 8).string(item.finish_time ? "Выполнено" : "В процессе").style(regular);
            row_n++;
        })
        //for (a = 0; a < API_RESPONSE.length; a++) {
        //    ws.cell(a + 2, 1)
        //    .number(API_RESPONSE[a].main.temp)
        //    .style(style);
        //}
        wb.write("Task Report.xlsx", res);
    }
    catch(err) {
        console.log(err);
    }
});

app.get("/api/analytics", (req, res) => {

    let sql_tasks = `SELECT * FROM tasks`;
    let sql_staff = `SELECT * FROM staff`;
    try {
        let db = new sqlite3.Database('./database/tasks.db', (err) => {
            if (err) {
                console.error(err.message);
                db.close()  
                throw err;
            }
            console.log('Connected to the database.');
            db.all(sql_tasks,[],(err, rows ) => {
                // console.log(rows);
                if (err) {
                    console.error(err.message);
                    db.close()  
                    throw err;
                }

                db.all(sql_staff,[],(err, staff_data) => {
                    if (err) {
                        console.error(err.message);
                        db.close()  
                        throw err;
                    }

                    staff_data.map((summary_row) => {
                        summary_row.daily = 20;
                        summary_row.mtd = 60;
                        summary_row.ytd = 80;
                    });

                    rows.map((row) => {
                        //console.log(row.finish_time)
                        const s_t = moment(row.start_time);
                        row.start_date = s_t.format("DD-MM-YYYY");
                        row.start_time = s_t.format("HH:mm:ss");
                        row.start = s_t.format("DD-MM-YYYY HH:mm:ss");
                        if (row.finish_time) {
                            const f_t = moment(row.finish_time);
                            row.finish_date = f_t.format("DD-MM-YYYY");
                            row.finish_time = f_t.format("HH:mm:ss");
                            row.finish = f_t.format("DD-MM-YYYY HH:mm:ss");
                            row.period = Math.ceil(moment.duration(f_t.diff(s_t)).asMinutes());
                        }
                    });
        
                    excelData.push(...rows);
                    const pivot_dta = {tasks: rows, summary: staff_data};
                    //console.log(pivot_dta);
                    res.send(pivot_dta);               
                    });

                });    
        });            

        db.close()  
    }
    catch(err) {
        console.log(err);
    }
});

app.post('/api/start', (req, res) => {
    const query = req.body.query;
    console.log("****START*********")
    console.log(query)
    //let sql_employee = `UPDATE staff SET active = 1 WHERE id == ?`;
    var t_id = 0;
    let sql_insertion = `INSERT INTO tasks (employee_name, task_description, start_time) VALUES (?, ? , ?)`;
    let sql_updated_res = `SELECT * FROM staff WHERE id == "${query.id}"`;

    try {
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

        db.close(); 
    }
    catch(err) {
        console.log(err);
    }
});
    
app.post('/api/stop', (req, res) => {
    const query = req.body.query;
    console.log("****STOP*********")
    console.log(query)

    let sql_employee = `UPDATE staff SET active = 0 WHERE id == ?`;
    let sql_update = `UPDATE tasks SET finish_time = ? WHERE id == ?`;
    let sql_updated_res = `SELECT * FROM staff WHERE id == "${query.id}"`;

    try {
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
        db.close();
    }
    catch(err) {
        console.log(err);
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join('/home/tachxoix/public_html/index.html'));
});

const PORT = process.env.PORT || 3001;

// app.listen();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});