import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sessionOptions } from "./config/sessionOptions.js";
import { router } from "./routes/router.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { flashMessages } from "./middleware/flashMiddleware.js";
/* import mysql from "mysql2/promise"; */

// Import middleware
import {
  generateCsrfToken,
  validateCsrfToken,
} from "./middleware/csrfMiddleware.js";
import { securityHeaders } from "./middleware/xssMiddleware.js";
import logger from "morgan";
import cookieParser from "cookie-parser";

try {
  // Create Express application.
  const app = express();
  const directoryFullName = dirname(fileURLToPath(import.meta.url));
  const baseURL = process.env.BASE_URL || "/";

  // Set up middleware
  app.use(logger("dev")); // Morgan
  app.use(securityHeaders); // Helmet
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(join(directoryFullName, "..", "public"))); // Adds static files.

  // Set up sessions
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  app.use(session(sessionOptions));

  // Middleware
  app.use(flashMessages);
  app.use(generateCsrfToken);
  app.use(validateCsrfToken);

  // View engine setup
  app.set("view engine", "ejs");
  app.set("views", join(directoryFullName, "views"));
  app.set("layout", join(directoryFullName, "views", "layouts", "default"));
  app.set("layout extractScripts", true);
  app.set("layout extractStyles", true);
  app.use(expressLayouts);

  // Set global variables
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL;
    res.locals.user = req.session.user || null;
    res.locals.session = req.session;
    next();
  });

  // Register routes
  app.use("/", router);

  // Error handler
  app.use(errorHandler);

  // Start server
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${server.address().port}`);
    console.log("Press Ctrl-C to terminate...");
  });
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}
