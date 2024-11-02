import express from "express";
const app = express();
import router from "./routes/indexRouter";
import { AppDataSource } from "./data-source";
import notFound from "./middlewares/notFound";
const port = 3001;

app.use(express.json());

app.use("/api", router);
app.use(notFound);

AppDataSource.initialize()
  .then(() => {
   // console.log("Data Source has been initialized!");

    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

// Export the app for use in other modules
export default app;
