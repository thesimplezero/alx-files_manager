import { MongoClient } from 'mongodb';

/**
 * Manages a MongoDB connection and provides utility methods for interacting
 * with the database, such as querying document counts and managing collections.
 */
class DBClient {
  /**
   * Initializes the MongoDB connection using environment variables or default settings,
   * and ensures essential collections exist in the database.
   */
  constructor() {
    // Define MongoDB connection URL with environment variables or defaults.
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;

    // Use unified topology configuration for MongoClient.
    const options = { useUnifiedTopology: true };

    // Connect to MongoDB asynchronously.
    MongoClient.connect(url, options).then(client => {
      this.db = client.db(database);
      this.ensureCollections(['users', 'files']);
    }).catch(err => {
      console.error('MongoDB connection error:', err);
    });
  }

  /**
   * Checks if the database connection is established.
   * @returns {boolean} True if the database connection is established, false otherwise.
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Retrieves the number of documents in the 'users' collection.
   * @returns {Promise<number>} The document count.
   */
  async nbUsers() {
    return this.db ? this.db.collection('users').countDocuments() : 0;
  }

  /**
   * Retrieves the number of documents in the 'files' collection.
   * @returns {Promise<number>} The document count.
   */
  async nbFiles() {
    return this.db ? this.db.collection('files').countDocuments() : 0;
  }

  /**
   * Finds a user document in the 'users' collection.
   * @param {object} user The query to find the user.
   * @returns {Promise<object>} The user document if found.
   */
  async findUser(user) {
    return this.db.collection('users').findOne(user);
  }

  /**
   * Creates a new user document in the 'users' collection.
   * @param {object} user The user document to insert.
   * @returns {Promise<object>} The result of the insertion operation.
   */
  async createUser(user) {
    return this.db.collection('users').insertOne(user);
  }

  /**
   * Ensures that specified collections exist in the database, creating them if they do not.
   * @param {string[]} collectionNames The names of collections to ensure existence.
   */
  async ensureCollections(collectionNames) {
    const existingCollections = await this.db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(col => col.name);

    await Promise.all(collectionNames.map(async (name) => {
      if (!existingCollectionNames.includes(name)) {
        await this.db.createCollection(name);
      }
    }));
  }
}

// Export a singleton instance of DBClient for global use.
export default new DBClient();
