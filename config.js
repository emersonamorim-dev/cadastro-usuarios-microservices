require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3018,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'usuariodb',
    password: process.env.DB_PASSWORD || 'sua-senha',
    database: process.env.DB_NAME || 'usuariodb',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis-cache',
    port: process.env.REDIS_PORT || 6379,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'c04779dfab3c600615de83347426a10612135f987b63339bae1a21b0751793e9def09273681300391f8139c014d188ec9e93592fbf70b8477d6da5f3baf3ea29',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
};
