const express = require('express');
const mysql = require('mysql2');
const app = express();


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


app.get('/api/pie-chart', (req, res) => {
    const { month } = req.query;

    if (!month || !monthMap[month]) {
        return res.status(400).json({ error: 'Invalid or missing month parameter' });
    }

    const monthNumber = monthMap[month];

    
    const query = `
        SELECT category, COUNT(*) AS item_count
        FROM product_transactions
        WHERE MONTH(date) = ?
        GROUP BY category;
    `;


    pool.query(query, [monthNumber], (err, results) => {
        if (err) {
            console.error('Error fetching data for pie chart:', err);
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }

    
        const categories = results.map(row => ({
            category: row.category,
            items: row.item_count
        }));

        res.json({
            month,
            categories
        });
    });
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
