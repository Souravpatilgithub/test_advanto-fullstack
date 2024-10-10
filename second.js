const express = require('express');
const mysql = require('mysql2');
const app = express();

const cors =require('cors');
app.use(cors());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Sourav@17',
    database: 'product_db'
});

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
};


app.get('/api/transactions', (req, res) => {
    const { search = '', page = DEFAULT_PAGE, per_page = DEFAULT_PER_PAGE, month } = req.query;

   
    const limit = parseInt(per_page, 10);
    const offset = (parseInt(page, 10) - 1) * limit;


    let query = `SELECT * FROM product_transactions WHERE 1=1`;
    let queryParams = [];


    if (search) {
        query += ` AND (title LIKE ? OR description LIKE ? OR price LIKE ?)`;
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern);
    }


    if (month && monthMap[month]) {
        query += ` AND MONTH(date) = ?`; 
        queryParams.push(monthMap[month]); 
    }

  
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    pool.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

      
        res.json({
            page: parseInt(page, 10),
            per_page: limit,
            results
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


