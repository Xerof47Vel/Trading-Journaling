import asyncpg
import asyncio
import os
import json
import boto3
from dotenv import load_dotenv

def load_secrets():
    secrets={}
    with open("./secrets.txt","r") as f:

async def insert_data_to_db(data):
    load_dotenv()
    d

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    
print(lambda_handler({}, {}))