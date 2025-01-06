import { createClient } from "redis";
import { any } from "zod";
const client = createClient();
client.on("error", function (error) {
    console.error(error);
});

async function processSubmission(submission:any) {
    const {  code, language } = JSON.parse(submission.element);

    console.log(`Processing submission for problemId `);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);
    // Here you would add your actual processing logic

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Finished processing submission for problemId `);
    }

async function worker() {
    try{
        await client.connect();
        console.log("Worker connected to Redis.");
        
        while(true){
            const submission:any = await client.blPop("submissions", 0);
            if(submission){
                console.log("Processing submission: ", submission);
                await processSubmission(submission);
            }
            }
            // await processSubmission();
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`Finished processing submission for problemId`);
        } 
    catch(err){
        console.error("error while submission ", err);
    }}

worker()