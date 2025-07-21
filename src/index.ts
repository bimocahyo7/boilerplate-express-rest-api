import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { authenticateToken } from "./middleware/auth-middleware";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(compression());
app.use(cors());
app.use(helmet());

app.use(authenticateToken);
app.use(routes);

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log("Server running on http://localhost:" + port)
);
