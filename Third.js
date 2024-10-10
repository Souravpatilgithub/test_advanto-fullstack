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

app.get('/api/statistics', (req, res) => {
    const { month } = req.query;

    if (!month || !monthMap[month]) {
        return res.status(400).json({ error: 'Invalid or missing month parameter' });
    }

    const monthNumber = monthMap[month];

    const query = `
        SELECT 
            SUM(CASE WHEN sold = 1 THEN price ELSE 0 END) AS total_sale_amount,  -- Total sale amount for sold items
            COUNT(CASE WHEN sold = 1 THEN 1 END) AS total_sold_items,            -- Count of sold items
            COUNT(CASE WHEN sold = 0 THEN 1 END) AS total_not_sold_items         -- Count of not sold items
        FROM product_transactions
        WHERE MONTH(date) = ?;
    `;

   
    pool.query(query, [monthNumber], (err, results) => {
        if (err) {
            console.error('Error fetching statistics:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const stats = results[0] || { total_sale_amount: 0, total_sold_items: 0, total_not_sold_items: 0 };
        res.json({
            month,
            total_sale_amount: stats.total_sale_amount || 0,    
            total_sold_items: stats.total_sold_items || 0,      
            total_not_sold_items: stats.total_not_sold_items || 0  
        });
    });
});

app.listen(7000, () => {
    console.log('Server is running on port 7000');
});


