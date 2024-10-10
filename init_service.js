const mysql = require('mysql2'); 
const axios = require('axios');

const pool = mysql.createPool({
    connectionLimit: 10,  
    host: 'localhost',
    user: 'root',         
    password: 'Sourav@17',
    database: 'product_db'  
});


const fetchData = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        console.log('Fetched data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
    }
};


const insertData = async (data) => {
    const insertPromises = data.map((item) => {
        const { title, price, category, sold,dateOfSale,description } = item;

        const query = `INSERT INTO product_transactions (title, price, category, sold,date,description)
                       VALUES (?, ?, ?, ?, ?,?)`;

        console.log('Inserting data:', { title, price, category, sold, dateOfSale,description }); 

        return new Promise((resolve, reject) => {
            pool.query(query, [title, price, category, sold,dateOfSale, description], (err, results) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    reject(err);
                } else {
                    console.log('Data inserted:', results.insertId);
                    resolve(results.insertId);
                }
            });
        });
    });

    
    try {
        await Promise.all(insertPromises);
        console.log('All data inserted successfully.');
    } catch (err) {
        console.error('Some inserts failed:', err);
    }
};


const initDatabase = async () => {
    const data = await fetchData();
    if (data) {
        insertData(data);
    }
};

initDatabase();

process.on('exit', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing the MySQL connection pool:', err);
        } else {
            console.log('MySQL connection pool closed.');
        }
    });
});
