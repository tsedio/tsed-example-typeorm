export default {
  name: "default",
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER || "test",
  password: process.env.POSTGRES_PASSWORD || "test",
  database: process.env.POSTGRES_DB || "test",
  synchronize: true,
  logging: process.env.POSTGRES_LOGIN === "true",
  entities: ["${rootDir}/entities/**/*.ts"],
  migrations: ["${rootDir}/migration/**/*.ts"],
  subscribers: ["${rootDir}/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "${rootDir}/entity",
    migrationsDir: "${rootDir}/migration",
    subscribersDir: "${rootDir}/subscriber"
  }
};
