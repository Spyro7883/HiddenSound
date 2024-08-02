const bcrypt = require('bcrypt');
const pool = require('../../src/utils/db');

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        // Hash the password
        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            try {
                const client = await pool.connect();
                const queryText = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
                const values = [username, email, hashedPassword];

                await client.query(queryText, values);
                client.release();

                res.status(201).json({ message: 'User created successfully' });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
export default handler;
