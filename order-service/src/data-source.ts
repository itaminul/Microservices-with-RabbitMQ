import { DataSource } from "typeorm";
import { Order } from "./entity/Order";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "aminul",
  password: "aminul",
  database: "mic_db",
  entities: [Order],
  migrations: ["src/migrations/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});
