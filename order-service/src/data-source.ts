import "reflect-metadata";


import { DataSource } from "typeorm";
import { Order } from "./entity/Order";
import { User } from "./entity/User";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "erpdb",
  password: "123456",
  database: "mic_db1",
  entities: [Order, User],
  migrations: ["src/migrations/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});

//  url: "postgres://erpdb:123456@localhost:5432/mic_db1",
//npm run typeorm -- migration:generate -d ./dist/data-source.js ./src/migrations/CreateUserTables
