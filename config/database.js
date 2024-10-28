module.exports = {
  host: process.env.DB_HOST || 'mysql-db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Elas1981XP#',
  database: process.env.DB_NAME || 'usuariodb',
  port: process.env.DB_PORT || 3306,

  jwt: {
    secret: process.env.JWT_SECRET || 'c04779dfab3c600615de83347426a10612135f987b63339bae1a21b0751793e9def09273681300391f8139c014d188ec9e93592fbf70b8477d6da5f3baf3ea29',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',  // Em formato legível pelo JWT
  },
  
};
