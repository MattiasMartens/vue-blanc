import * as express from "express";

const app = express();
const port = 3012;

app.use("/", express.static(__dirname));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
