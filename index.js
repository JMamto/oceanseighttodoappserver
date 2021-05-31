const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');


//port
const PORT = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//routes

//register / login routes 
app.use("/auth", require("./routes/jwtAuth"));

//dashboard routes

app.use("/dashboard", require("./routes/dashboard"));

//landing page
app.get('/', async(req, res) =>{
   res.send('Welcome to the server')
    
});


//!        add a todo
app.post('/todos', async(req, res) =>{
    try{
        //>if requires a parameter
        //const {id} = req.params;

        //>if requires data from body
        const data = req.body;

        const queryText = `insert into oceanseight_todo.todo(user_id, todo_name, description, date, status)
                            values($1, $2, $3, $4, 'Incomplete') returning *`;
        const dataQuery = [data.uid, data.todo_name, data.description, data.date];

        const query = await pool.query(queryText,dataQuery);

        console.log(query.rows)
        await pool.query(`call oceanseight_todo.addRelation($1, $2);`, [data.uid, query.rows[0].todo_id])
        
        res.json(query.rows);



    }catch(error){
        console.error(error.message);
        res.send('An error has occured')
    }

});

//!     get all todos
app.get('/todos', async(req, res) =>{

    try{
        //>if requires a parameter
        //const {id} = req.params;

        //>if requires data from body
        //const data = req.body;

        //const queryText = ;
        //const dataQuery = ;

        const query = await pool.query(`select * from oceanseight_todo.todo`);
        res.json(query.rows);

    }catch(error){
        console.error(error.message);
        res.send('An error has occured')
    }

});

//!      get a todo
app.get('/todos/:id', async(req, res) =>{

    try{
        //>if requires a parameter
        const {id} = req.params;

        //>if requires data from body
        //const data = req.body;

        //const queryText = ;
        //const dataQuery = ;

        const query = await pool.query(`select * from oceanseight_todo.todo where todo_id = $1`, [id]);
        res.json(query.rows);

    }catch(error){
        console.error(error.message);
        res.send('An error has occured')
    }

});
app.post('/utodos', async(req, res) =>{

    try{
        //>if requires a parameter
        //const {id} = req.params;

        //>if requires data from body
        const {uid} = req.body;


        const queryText = `select * from oceanseight_todo.todo where user_id = $1`;
        const dataQuery = [uid];

        const query = await pool.query(queryText, dataQuery);
        res.json(query.rows);

    }catch(error){
        console.error(error.message);
        res.send('An error has occured')
    }

});



//!         update a todo

app.put('/todos/:id', async(req, res) =>{

    try{
        //>if requires a parameter
        const {id} = req.params;

        //>if requires data from body
        const data = req.body;

        const queryText = `
        
        update oceanseight_todo.todo set todo_name = $1, description = $2, date = $3 , status = $4 where todo_id = $5`;
        const dataQuery = [data.todo_name, data.description, data.date, data.status, id];

        const query = await pool.query(queryText, dataQuery);
        res.json("todo was updated");

    }catch(error){
        console.error(error.message);
        res.send('An error has occured')
    }

});

//!         delete a todo

app.delete('/todos/:id', async(req, res) =>{

    try{
        //>if requires a parameter
        const {id} = req.params;

        //>if requires data from body
        //const data = req.body;

        //const queryText = ;
        //const dataQuery = ;
        await pool.query(`delete from oceanseight_todo."userTodos" where todo_id = $1`, [id])
        const query = await pool.query(`delete from oceanseight_todo.todo where todo_id = $1`, [id]);
        res.json("delete successful");

    }catch(error){
        console.error(error.message);
        res.send('An error has occured')
    }

});
app.listen(PORT, () => {
    console.log(`Server started as localhost at Port: ${PORT}`)
})