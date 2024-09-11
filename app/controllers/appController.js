const { Pool } = require('pg');
const pool = new Pool();

async function refactoreMe1() {
  const query = `
    SELECT * FROM users
    WHERE created_at > NOW() - INTERVAL '30 days'
    ORDER BY created_at DESC
  `;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

async function refactoreMe2(id) {
    const query = `
        SELECT * FROM another_table
        WHERE id = $1;
    `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

exports.callmeWebSocket = (req, res) => {
    // do something
    const wss = new WebSocket.Server({ server });

    wss.on('connection', ws => {
        // Send data every 3 minutes
        const intervalId = setInterval(async () => {
            try {
                const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
                ws.send(JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching API data:', error);
            }
        }, 180000); // 3 minutes = 180000 ms

        ws.on('close', () => {
            clearInterval(intervalId); // Stop sending data when client disconnects
        });
    });
  };

  exports.getData = (req, res) => {
    // do something
    try {
        const cacheKey = 'attack_data';
        
        // Check if data exists in Redis
        client.get(cacheKey, async (err, cachedData) => {
            if (cachedData) {
                return res.json(JSON.parse(cachedData)); // Return cached data
            }
            
            // Query the database using native SQL
            const query = `
                SELECT destination_country, COUNT(*) AS total 
                FROM attacks
                GROUP BY destination_country;
            `;
            const result = await pool.query(query);
            
            const data = {
                success: true,
                statusCode: 200,
                data: {
                    label: result.rows.map(row => row.destination_country),
                    total: result.rows.map(row => parseInt(row.total, 10))
                }
            };
            
            // Cache the result in Redis for 5 minutes
            client.setex(cacheKey, 300, JSON.stringify(data));
            
            res.json(data);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
  };