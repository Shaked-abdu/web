import initApp from "./app";
import https from "https";
import fs from "fs";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

initApp().then((app) => {
  if (process.env.NODE_ENV === "development") {
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "API",
          description: "API Information",
          version: "1.0.0",
        },
        servers: [{ url: "http://localhost:3000" }],
      },
      apis: ["./src/routes/*.ts", "./src/models/*.ts"],
    };
    const specs = swaggerJsDoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }


  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(process.env.PORT);
  } else {
    console.log('PRODUCTION');
    const options2 = {
      key: fs.readFileSync('../../client-key.pem'),
      cert: fs.readFileSync('../../client-cert.pem')
    };
    https.createServer(options2, app).listen(process.env.HTTPS_PORT);
  }
});
