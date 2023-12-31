import { useExpressRouter } from "../../lib";
import express from "express";

const app = express();

useExpressRouter(app, {
    directory: "./dist/routes",
    authentication: {
        token: "password",
        enabledByDefault: false
    }
});

app.listen(3000, () => console.log("http://localhost:3000/"))