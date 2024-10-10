const express = require('express');
const axios = require('axios');
const app = express();



app.get('/api/combined', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Missing month parameter' });
    }

    try {
       
        const statisticsApiUrl = `http://localhost:7000/api/statistics?month=${month}`;
        const barChartApiUrl = `http://localhost:4444/api/bar-chart?month=${month}`;
        const pieChartApiUrl = `http://localhost:3001/api/pie-chart?month=${month}`;

        
        const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
            axios.get(statisticsApiUrl),
            axios.get(barChartApiUrl),
            axios.get(pieChartApiUrl)
        ]);

        const combinedResponse = {
            month,
            statistics: statisticsResponse.data,
            bar_chart: barChartResponse.data,
            pie_chart: pieChartResponse.data
        };

       
        res.json(combinedResponse);

   } catch (err) {
        
        console.error('Error fetching data from APIs:', err.message);
        res.status(500).json({ error: 'Failed to fetch data from one or more APIs', details: err.message });
   }
});




app.listen(3333, () => {
    console.log('Server is running on port 3333');
});
