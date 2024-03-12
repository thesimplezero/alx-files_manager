import sha1 from 'sha1';
import dbClient from '../utils/db';

const UsersController = {
  // Endpoint for creating a new user
  postNew: async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    // Check if user already exists
    const userExists = await dbClient.findUser({ email });
    if (userExists) return res.status(400).send({ error: 'Already exist' });

    // Create new user with hashed password
    const securePassword = sha1(password);
    const result = await dbClient.createUser({ email, password: securePassword });

    // Send formatted response
    const newUser = { id: result.insertedId, email };
    res.status(201).send(newUser);
  },
};

module.exports = UsersController;
