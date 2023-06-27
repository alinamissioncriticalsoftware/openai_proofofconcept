import {OpenAIClient, AzureKeyCredential } from "@azure/openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AZURE_OPEN_AI_KEY, AZURE_OPEN_AI_BASE_URL, AZURE_OPEN_AI_DEPLOYMENT_NAME } from "./config.js";

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

const client = new OpenAIClient(AZURE_OPEN_AI_BASE_URL, new AzureKeyCredential(AZURE_OPEN_AI_KEY));

app.post("/general", async (request, response) => {
    try {
        const result  = 
            await client.getCompletions(AZURE_OPEN_AI_DEPLOYMENT_NAME, request.body.prompt, {
                maxTokens: 150,
                temperature: 0.9,
                topP: 1,
                frequencyPenalty: 0.0,
                presencePenalty: 0.6,
                model: "text-davinci-003"
            });
    
        response.json({
            output: result.choices[0].text
        });
    }    
    catch (e) { 
        console.log(e);
    }
});

const buildPromptForDescription = (request) => { 
    return `Generate a description for an estate of type ${request.category} with ${request.bedrooms} bedrooms, 
        ${request.bathrooms} bathrooms, ${request.garages} garages, and ${request.area} square feet at the address ${request.address}. 
        Provide the english version as well as the french version and the dutch version like an JSON containing an array of objects as follows:
        [{"languageId":"en-GB", "name":  Here comes the english description in qoutes}, 
        {"languageId":"fr-BE", "name":  Here comes the french description in qoutes},
        {"languageId":"nl-BE", "name":  Here comes the dutch description in qoutes}]
        For each version the maximum number of characters is ${request.maxCharacters}}`;
}
app.post("/generateDescription", async (request, response) => {
    const prompt = buildPromptForDescription(request.body);
    try {
        const result  = 
            await client.getCompletions(AZURE_OPEN_AI_DEPLOYMENT_NAME, prompt, {
                maxTokens: 3 * request.body.maxCharacters,
                temperature: 0.9,
                topP: 1,
                frequencyPenalty: 0.0,
                presencePenalty: 0.6,
                model: "text-davinci-003"
            });
    
        response.json({
            chatGPT: result.choices[0].text
        });
    }    
    catch (e) { 
        console.log(e);
    }
});

const buildPromptForTextCorrection = (request) => { 
    return `Spot the mistakes in the following text: ${request.text}. Provide the HTML version of the initial text having the mistakes underlined and with font color red. 
    Provide separately also the text corrected in the HTML.
    The maximum number of characters is ${request.maxCharacters}} and the layout of the response should be like this:
    WRONG TEXT: This is the wrong text in HTML format
    CORRECT TEXT: This is the correct text in HTML format including the changes in green color and the rest in white color`
    ;
}
app.post("/corectText", async (request, response) => {
    const prompt = buildPromptForTextCorrection(request.body);
    try {
        const result  = 
            await client.getCompletions(AZURE_OPEN_AI_DEPLOYMENT_NAME, prompt, {
                maxTokens: request.body.maxCharacters,
                temperature: 0.9,
                topP: 1,
                frequencyPenalty: 0.0,
                presencePenalty: 0.6,
                model: "text-davinci-003"
            });
    
        response.json({
            output: result.choices[0].text
        });
    }    
    catch (e) { 
        console.log(e);
    }
});

const buildPromptForAnsweringEmail = (request) => { 
    return `Answer the following email: ${request.email} in a politely and kindly. Provide the HTML version of the entire email with the answer in the HTML format.`
}

app.post("/answerEmail", async (request, response) => {
    const prompt = buildPromptForAnsweringEmail(request.body);
    try {
        const result  = 
            await client.getCompletions(AZURE_OPEN_AI_DEPLOYMENT_NAME, prompt, {
                maxTokens: request.body.maxCharacters,
                temperature: 0.9,
                topP: 1,
                frequencyPenalty: 0.0,
                presencePenalty: 0.6,
                model: "text-davinci-003"
            });
    
        response.json({
            output: result.choices[0].text
        });
    }    
    catch (e) { 
        console.log(e);
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


