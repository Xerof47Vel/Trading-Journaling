
import os
import json
import boto3
from dotenv import load_dotenv


def lambda_handler(event, context):
    return {
    'statusCode': 200,
    'headers': {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    },
    'body': json.dumps('Hello from Lambda!'),
    };
    
print(lambda_handler({}, {}))