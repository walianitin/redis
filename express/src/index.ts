import { Express } from "express";
// import {redisClient}
import { createClient } from "redis";
const app= require("express")();
const redisClient = createClient();
redisClient.on("error", function (error: any) {
  console.error("Redis Client Error", error);
});

app.use(require("express").json());


app.post("/", async (req: any, res: any) => {
    const { userId, languageId, code } = req.body;
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        console.log(redisClient.isOpen);
       const result= await redisClient.lPush("submissions", JSON.stringify({ userId, languageId, code }));
       console.log(result);
       const result2 = await redisClient.lRange("submissions", 0, -1);
       console.log(result2); // This should return the elements in the list.
        console.log("Data pushed to Redis queue.");
        res.status(200).send("Submission received and stored." + JSON.stringify({ userId, languageId, code }));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error storing submission.");
    }
});


async function startServer(){
    try{
        await redisClient.connect();
        console.log("Connected to Redis");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        })
    }
    catch(err){
        console.error(err,"Error while connecting to Redis");
    }
}

startServer();  