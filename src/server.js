const Hapi = require("@hapi/hapi");
const routes = require("./routes");
require("dotenv").config();

const host = process.env.HOST;
const port = process.env.PORT;

const init = async () => {
    const server = Hapi.server({
        port: port,
        host: host,
    });

    server.route(routes);

    await server.start();

    console.log(`server is running on ${server.info.uri}`);
};

init();