const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors =require('cors');
app.use(cors()); 
// MySQL connection pool configuration
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Sourav@17',
    database: 'product_db'
});

// Map month names to month numbers
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

// API Route to get bar chart data for price ranges
app.get('/api/bar-chart', (req, res) => {
    const { month } = req.query;

    // Ensure a valid month is provided
    if (!month || !monthMap[month]) {
        return res.status(400).json({ error: 'Invalid or missing month parameter' });
    }

    const monthNumber = monthMap[month];

    // SQL query to count items in each price range for the selected month
    const query = `
        SELECT 
            COUNT(CASE WHEN price BETWEEN 0 AND 100 THEN 1 END) AS '0-100',
            COUNT(CASE WHEN price BETWEEN 101 AND 200 THEN 1 END) AS '101-200',
            COUNT(CASE WHEN price BETWEEN 201 AND 300 THEN 1 END) AS '201-300',
            COUNT(CASE WHEN price BETWEEN 301 AND 400 THEN 1 END) AS '301-400',
            COUNT(CASE WHEN price BETWEEN 401 AND 500 THEN 1 END) AS '401-500',
            COUNT(CASE WHEN price BETWEEN 501 AND 600 THEN 1 END) AS '501-600',
            COUNT(CASE WHEN price BETWEEN 601 AND 700 THEN 1 END) AS '601-700',
            COUNT(CASE WHEN price BETWEEN 701 AND 800 THEN 1 END) AS '701-800',
            COUNT(CASE WHEN price BETWEEN 801 AND 900 THEN 1 END) AS '801-900',
            COUNT(CASE WHEN price > 900 THEN 1 END) AS '901-above'
        FROM product_transactions
        WHERE MONTH(date) = ?;
    `;

    // Execute the query
    pool.query(query, [monthNumber], (err, results) => {
        if (err) {
            console.error('Error fetching data for bar chart:', err);
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }

        // Format the results for the bar chart
        const data = results[0] || {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0
        };

        res.json({
            month,
            price_ranges: {
                '0-100': data['0-100'],
                '101-200': data['101-200'],
                '201-300': data['201-300'],
                '301-400': data['301-400'],
                '401-500': data['401-500'],
                '501-600': data['501-600'],
                '601-700': data['601-700'],
                '701-800': data['701-800'],
                '801-900': data['801-900'],
                '901-above': data['901-above']
            }
        });
    });
});

// Start the server
app.listen(4444, () => {
    console.log('Server is running on port 4444');
});
