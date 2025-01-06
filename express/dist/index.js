"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {redisClient}
const redis_1 = require("redis");
const app = require("express")();
const redisClient = (0, redis_1.createClient)();
redisClient.on("error", function (error) {
    console.error("Redis Client Error", error);
});
app.use(require("express").json());
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, languageId, code } = req.body;
    try {
        if (!redisClient.isOpen) {
            yield redisClient.connect();
        }
        console.log(redisClient.isOpen);
        const result = yield redisClient.lPush("submissions", JSON.stringify({ userId, languageId, code }));
        console.log(result);
        const result2 = yield redisClient.lRange("submissions", 0, -1);
        console.log(result2); // This should return the elements in the list.
        console.log("Data pushed to Redis queue.");
        res.status(200).send("Submission received and stored." + JSON.stringify({ userId, languageId, code }));
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error storing submission.");
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redisClient.connect();
            console.log("Connected to Redis");
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
        }
        catch (err) {
            console.error(err, "Error while connecting to Redis");
        }
    });
}
startServer();
