export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST,
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    database: process.env.DEV_DB,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    password: process.env.DB_PASSWORD,
  },
});
