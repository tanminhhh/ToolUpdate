/**
 * Production configuration for the Tài Xỉu Prediction Tool
 * This file contains settings used when deploying the application to production environments
 */

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
    compression: true
  },

  // Cache settings
  cache: {
    maxAge: 86400000, // 1 day in milliseconds
    etag: true,
    lastModified: true
  },

  // Security settings
  security: {
    helmet: true,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },

  // Storage settings
  storage: {
    type: 'memory', // Can be changed to 'database' if needed
    path: './data'
  }
}