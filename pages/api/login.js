const bcrypt = require('bcrypt');
const pool = require('../../src/utils/db');

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        try {
            const client = await pool.connect();
            const queryText = 'SELECT email, password FROM users WHERE email = $1';
            const values = [email];

            const result = await client.query(queryText, values);
            client.release();

            if (result.rows.length === 0) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const user = result.rows[0];

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                res.status(401).json({ error: 'Invalid password' });
                return;
            }

            res.status(200).json({ message: 'Login successful' });
        } catch (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
export default handler;
