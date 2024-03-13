import mongodb from 'mongodb';
import envLoader from './env_loader';

/**
 * Manages the MongoDB client connection and provides methods to interact
 * with the database for common operations such as counting documents in collections.
 */
class DBClient {
  /**
   * Initializes the MongoDB client using environment variables for configuration.
   * Establishes a connection to the MongoDB server.
   */
  constructor() {
    envLoader(); // Load environment variables.
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.database = this.connect();
  }

  /**
   * Asynchronously connects to the MongoDB database and logs errors if any.
   * @returns {Promise<mongodb.Db>} The database instance.
   */
  async connect() {
    try {
      await this.client.connect();
      console.log('Connected successfully to MongoDB');
      return this.client.db();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Checks if the MongoDB client is currently connected.
   * @returns {boolean} True if the client is connected, otherwise false.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Asynchronously counts the number of documents in the 'users' collection.
   * @returns {Promise<number>} The count of documents in the collection.
   */
  async nbUsers() {
    const db = await this.database;
    return db.collection('users').countDocuments();
  }

  /**
   * Asynchronously counts the number of documents in the 'files' collection.
   * @returns {Promise<number>} The count of documents in the collection.
   */
  async nbFiles() {
    const db = await this.database;
    return db.collection('files').countDocuments();
  }

  /**
   * Provides a reference to the 'users' collection.
   * @returns {mongodb.Collection} The 'users' collection.
   */
  async usersCollection() {
    const db = await this.database;
    return db.collection('users');
  }

  /**
   * Provides a reference to the 'files' collection.
   * @returns {mongodb.Collection} The 'files' collection.
   */
  async filesCollection() {
    const db = await this.database;
    return db.collection('files');
  }
}

// Export an instance of DBClient for use throughout the application.
export const dbClient = new DBClient();
export default dbClient;
