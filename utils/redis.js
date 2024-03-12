import { createClient } from 'redis';
const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Initialize Redis client and setup connection and error event listeners.
    this.client = createClient();
    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
      this.isConnected = false;
    });
    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.isConnected = true;
    });
  }

  // Check if the client is connected to Redis.
  isAlive() {
    return this.isConnected;
  }

  // Retrieve a value by key from Redis.
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return await getAsync(key);
  }

  // Set a value with an expiration.
  set(key, value, duration) {
    this.client.setex(key, duration, value);
  }
}

// Export an instance of RedisClient.
export default new RedisClient();
