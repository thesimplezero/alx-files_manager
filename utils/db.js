import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Initialize MongoDB connection with environment variables or defaults.
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/`;

    // Connect to MongoDB and handle connection errors.
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error('MongoDB connection error:', err);
        return;
      }
      this.db = client.db(database);
      
      // Ensure essential collections are present.
      this.ensureCollections(['users', 'files']);
    });
  }

  // Check if the database connection is established.
  isAlive() {
    return !!this.db;
  }

  // Get the number of documents in the 'users' collection.
  async nbUsers() {
    return this.db?.collection('users').countDocuments() || 0;
  }

  // Get the number of documents in the 'files' collection.
  async nbFiles() {
    return this.db?.collection('files').countDocuments() || 0;
  }

  // Find a user document.
  async findUser(user) {
    return this.db.collection('users').findOne(user);
  }

  // Create a new user document.
  async createUser(user) {
    return this.db.collection('users').insertOne(user);
  }

  // Ensure specified collections exist, creating them if not.
  async ensureCollections(collectionNames) {
    const existingCollections = await this.db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(col => col.name);
    
    collectionNames.forEach(async (name) => {
      if (!existingCollectionNames.includes(name)) {
        await this.db.createCollection(name);
      }
    });
  }
}

// Export a singleton instance of DBClient.
export default new DBClient();
