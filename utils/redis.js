import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * A wrapper class for Redis client operations, providing a simplified and
 * asynchronous interface to interact with Redis data store.
 */
class RedisClient {
  /**
   * Initializes the Redis client and sets up event listeners for connection
   * handling and error monitoring.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = false;

    // Convert Redis client methods to Promises for better async handling.
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setexAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    // Setup connection event listeners.
    this.client.on('error', (err) => {
      console.error(`Redis client failed to connect: ${err.message || err.toString()}`);
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      console.log('Redis client connected successfully.');
      this.isClientConnected = true;
    });
  }

  /**
   * Checks whether the client is currently connected to the Redis server.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Asynchronously retrieves the value for a specified key from Redis.
   * @param {string} key - The key whose value is to be retrieved.
   * @returns {Promise<string | object>} The value of the key, if found.
   */
  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (err) {
      console.error(`Error retrieving key "${key}": ${err}`);
      throw err;
    }
  }

  /**
   * Asynchronously stores a key-value pair in Redis with an expiration time.
   * @param {string} key - The key under which the value is stored.
   * @param {string | number | boolean} value - The value to be stored.
   * @param {number} duration - The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    try {
      await this.setexAsync(key, duration, value);
    } catch (err) {
      console.error(`Error setting key "${key}": ${err}`);
      throw err;
    }
  }

  /**
   * Asynchronously deletes a key-value pair from Redis.
   * @param {string} key - The key to be removed.
   * @returns {Promise<void>}
   */
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error(`Error deleting key "${key}": ${err}`);
      throw err;
    }
  }
}

// Export an instance of RedisClient for use elsewhere in the application.
export const redisClient = new RedisClient();
export default redisClient;
