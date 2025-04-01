import boto3 

import os
import pymysql 
import json
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file
AWS_Region=os.getenv("AWS_REGION")

DB_host=os.getenv('DB_HOST')
DB_port=os.getenv('DB_PORT')
DB_NAME=os.getenv("DB_NAME")
DB_PASSWORD=os.getenv("DB_PASSWORD")
DB_USER=os.getenv("DB_USER")
conn=None

def connect_to_db():
    
    try:
        conn=pymysql.connect(
        host=DB_host,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=int(DB_port),
        cursorclass=pymysql.cursors.DictCursor
        )
        print("Connected to the database")
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to the database: {e}")
        return None

def insert_data(body):
    global conn
    if conn is None:
        conn = connect_to_db()
    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO trades (
                user_id, account_number, trade_images, commodity, trade_type, lot_size, 
                entry_price, exit_price, open_date, close_date, profit_loss, equity_before, 
                equity_after, stop_loss, take_profit, strategy, comments, tags
            ) VALUES (
                %s, %s, %s, %s, %s, %s, 
                %s, %s, %s, %s, %s, %s, 
                %s, %s, %s, %s, %s, %s
            )
            """  # Remove the "Returning id;" line
            
            values=(
                body["userId"], body["accountNumber"], body["tradeLink"], body["commodity"],
                body["tradeType"], float(body["lotSize"]), float(body["entryPrice"]),
                float(body["exitPrice"]), body["openDate"], body["closeDate"],
                float(body["profitLoss"]), float(body["equityBefore"]), float(body["equityAfter"]),
                float(body["stopLoss"]), float(body["takeProfit"]), body["strategy"],
                body["comments"], body["tags"]
            )
            cursor.execute(sql, values)
            conn.commit()
            
            # Get the last inserted ID
            cursor.execute("SELECT LAST_INSERT_ID()")
            id_result = cursor.fetchone()
            inserted_id = id_result["LAST_INSERT_ID()"]
            
            print(f"Inserted data with ID: {inserted_id}")
            return inserted_id
    except pymysql.MySQLError as e:
        print(f"Error inserting data: {e}")
        return None
    finally:
        if conn:
            conn.close()
            print("Database connection closed")
def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        print(f"Received body: {body}")
        id = insert_data(body)
        if id:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Data inserted successfully', 'id': id})
            }
        else:
            return {
                'statusCode': 500,
                'body': json.dumps({'message': 'Error inserting data'})
            }
    except Exception as e:
        print(f"Error in lambda_handler: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error'})
        }
