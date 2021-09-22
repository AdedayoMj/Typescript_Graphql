import express from "express";
import http from "http";
import config from "./config/config";
import logging from "./config/logging";
import * as dotenv from "dotenv";
import cors from "cors";
import cluster from "cluster";
import mongoose from "mongoose";
import { cpus } from "os";
import process from "process";
import { graphqlHTTP } from "express-graphql";
const schema = require("./schema/schema");

// const throng = require('throng')
// const WORKERS = process.env.WEB_CONCURRENCY || 1
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const router = express();
  dotenv.config();
  /**allow cors */
  router.use(cors());
  /** Server Handling */
  const httpServer = http.createServer(router);
  /** Parse the body of the request */
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Connect to Mongo */
  mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
      logging.info("Mongo Connected");
    })
    .catch((error) => {
      logging.error(error);
    });

  /** Log the request */
  router.use((req, res, next) => {
    logging.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      logging.info(
        `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
      );
    });

    next();
  });

  router.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );
  /** Error handling */
  router.use((req, res, next) => {
    const error = new Error("Not found");

    res.status(404).json({
      message: error.message,
    });
  });

  httpServer.listen(process.env.PORT || 2121, () =>
    logging.info(`Server is running ${config.server.host}:${process.env.PORT}`)
  );
  console.log(`Worker ${process.pid} started`);
}
