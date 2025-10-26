import mongoose from 'mongoose';

// Define the type for our cached connection
interface CachedConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Extend the global object to include our cached connection
declare global {
  var mongooseCache: CachedConnection | undefined;
}

// MongoDB connection URI from environment variables
// Note: Validation is now done inside connectToMongoDB to avoid import-time failures

/**
 * Global cache for the MongoDB connection to prevent multiple connections
 * during development when modules are hot-reloaded
 */
let cached: CachedConnection = global.mongooseCache || { conn: null, promise: null };

// Store the cache globally to persist across hot reloads in development
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * 
 * This function implements connection caching to prevent multiple connections
 * during development when Next.js hot-reloads modules. In production, this
 * helps optimize connection reuse.
 * 
 * @returns Promise<mongoose.Connection> - The MongoDB connection instance
 */
async function connectToMongoDB(): Promise<mongoose.Connection> {
  // Validate environment variables
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if one is pending
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable Mongoose buffering
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Create new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB');
      return mongooseInstance.connection;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    // Wait for connection to be established
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset promise on connection failure
    cached.promise = null;
    throw error;
  }
}

/**
 * Gracefully closes the MongoDB connection
 * Useful for cleanup in serverless environments or application shutdown
 */
async function disconnectFromMongoDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}

/**
 * Gets the current connection status
 * @returns The current mongoose connection state
 */
function getConnectionStatus(): number {
  return mongoose.connection.readyState;
}

/**
 * Connection state constants for reference
 */
export const CONNECTION_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
} as const;

export type ConnectionState = typeof CONNECTION_STATES[keyof typeof CONNECTION_STATES];

// Export the main connection function as default
export default connectToMongoDB;

// Export additional utility functions
export { 
  disconnectFromMongoDB, 
  getConnectionStatus 
};