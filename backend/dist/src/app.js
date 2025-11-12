"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("../src/routers/auth.route"));
const user_route_1 = __importDefault(require("../src/routers/user.route"));
const property_route_1 = __importDefault(require("../src/routers/property.route"));
const favourite_route_1 = __importDefault(require("../src/routers/favourite.route"));
const morgan_1 = __importDefault(require("morgan"));
const image_route_1 = __importDefault(require("../src/routers/image.route"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const _APP_PORT = process.env.APP_PORT || 4000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api", auth_route_1.default);
app.use("/api", user_route_1.default);
app.use("/api", property_route_1.default);
app.use("/api", favourite_route_1.default);
app.use("/api", image_route_1.default);
app.get("/", (req, res) => {
    res.json("Welcome to WiseAI API v1");
});
app.listen(_APP_PORT, () => {
    try {
        console.log(`Server is running at http://localhost:${_APP_PORT}`);
    }
    catch (error) {
        console.log("Server has some error:", error);
    }
});
