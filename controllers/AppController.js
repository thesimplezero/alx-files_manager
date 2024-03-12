import dbClient from '../utils/db';

const AppController = {
  // Endpoint to check the status of Redis and MongoDB connections
  getStatus: async (req, res) => {
    try {
      const redisStatus = await dbClient.isAlive(); // Assumes dbClient to have Redis check method
      const dbStatus = await dbClient.isAlive();

      res.status(200).json({ db: dbStatus, redis: redisStatus });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Endpoint to get statistics (number of users and files)
  getStats: async (req, res) => {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();

      res.status(200).json({ users, files });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = AppController;
