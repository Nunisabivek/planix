const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.mongoURI = process.env.MONGODB_URI;
    this.connection = null;
  }

  async connect() {
    try {
      if (!this.mongoURI) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Use IPv4, skip trying IPv6
      };

      this.connection = await mongoose.connect(this.mongoURI, options);
      
      console.log('✅ MongoDB Atlas connected successfully');
      console.log(`📍 Database: ${this.connection.connection.name}`);
      console.log(`🔗 Host: ${this.connection.connection.host}`);
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected');
      }
    } catch (error) {
      console.error('❌ MongoDB disconnect error:', error);
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database();