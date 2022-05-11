import express from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
// import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";
import ProductsRoutes from "./routes/ProductsRoutes";
import SalesRoutes from "./routes/SalesRoutes";
import ProvidersRoutes from "./routes/ProvidersRoutes";
class Server {
   public app: express.Application;

   constructor() {
      dotenv.config();
      this.app = express();
      this.config();
      this.routes();
   }

   config(): void {
      this.app.set("port", process.env.MONGO_PORT || 3000);
      //Middlewares
      this.app.use(morgan("dev"));
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(helmet());
      this.app.use(compression());
      this.app.use(cors());
   }
   start() {
      this.app.listen(process.env.PORT || 3000, () => {
         console.log("Server on port", process.env.PORT || 3000);
      });
   }

   routes(): void {
      this.app.use("/api/products", ProductsRoutes);
      this.app.use("/api/sales", SalesRoutes);
      this.app.use("/api/providers", ProvidersRoutes);
   }
}

const server = new Server();
server.start();
