const {Pool} = require('pg');

const pool = new Pool({
    user: 'vjjzvrrggzsegg',
    password: '1e4c6be66ef9a87071fa03c830e5437a95738f8b61e947175bb4c71770ab676d',
    host: 'ec2-54-225-228-142.compute-1.amazonaws.com',
    port: 5432,
    database: 'dci1h6ohad5bha',
    ssl:{
        rejectUnauthorized: false
    }
});
module.exports = pool;