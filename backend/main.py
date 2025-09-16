# backend/main.py

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class Message(BaseModel):
    message: str

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def handle_chat(message: Message):
    user_message = message.message.lower()
    bot_response = f"You said: '{user_message}'"
    
    if "hello" in user_message:
        bot_response = "Hi there! How can I help you today?"
    elif "how are you" in user_message:
        bot_response = "I'm just a bot, but I'm doing great! Thanks for asking."
    elif "will we win sih" in user_message:
        bot_response = "If your frontend team works harder and learns more than css, Sure you can make it!!! 💪"
    else:
        bot_response = "Fallback Error"

    return {"response": bot_response}