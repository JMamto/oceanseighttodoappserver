const pool = require("../db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwtGenerator = require ("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");


router.post("/register", validInfo, async(req, res) =>{

    try {
        
        const {name, email, password} = req.body;

        const user = await pool.query(`select * from oceanseight_todo.users
                                       where user_email = $1`, [email])
        

       //>if email exists 
       if(user.rows.length !== 0){
           return res.status(401).json('Email already exist!');
       }
       
       //> encrypts password
       const saltRound = 10;
       const salt = await bcrypt.genSalt(saltRound);
       const bcryptPassword  = await bcrypt.hash(password, salt);


       //> store new user 
       const newUser = await pool.query(`insert into oceanseight_todo.users(user_name, user_email, user_password)
                                         values($1, $2, $3) returning *`, [name, email, bcryptPassword])



       //> generate token

       const token = jwtGenerator(newUser.rows[0].user_id);
       res.json({token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//login route

router.post("/login", validInfo, async (req, res) =>{
    try {
        const {email, password} = req.body;

        const user = await pool.query(`select * from oceanseight_todo.users where user_email = $1`, [email]);

        if(user.rows.length === 0){
            return res.status(401).json('Incorrect user or password');
        }



        //> check if password is correct (returns a boolean)

        const isValidPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if(!isValidPassword)
            return res.status(401).json('Invalid password');


        //> give token

        const token = jwtGenerator(user.rows[0].user_id);
        res.json({token})

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

router.get("/is-verify", authorization, async(req,res) => {
    try {
        res.json(true);

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
 });

module.exports = router;