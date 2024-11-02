import "reflect-metadata";

import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Delivery } from "./entity/Delivery";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "erpdb",
  password: "123456",
  database: "delivery_db",
  entities: [Delivery, User],
  migrations: ["src/migrations/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});

//  url: "postgres://erpdb:123456@localhost:5432/order_db",
//npm run typeorm -- migration:generate -d ./dist/data-source.js ./src/migrations/CreateUserTables
