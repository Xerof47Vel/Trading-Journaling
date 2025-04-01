from datetime import datetime
import boto3
import decimal
import os
import pymysql
import json
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file
AWS_Region = os.getenv("AWS_REGION")

DB_host = os.getenv("DB_HOST")
DB_port = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_USER = os.getenv("DB_USER")
conn = None


def connect_to_db():

    try:
        conn = pymysql.connect(
            host=DB_host,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=int(DB_port),
            cursorclass=pymysql.cursors.DictCursor,
        )
        print("Connected to the database")
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to the database: {e}")
        return None


def get_trades(userID):
    global conn
    if conn is None:
        conn = connect_to_db()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM trades WHERE user_id = %s"
            cursor.execute(sql, (userID,))
            result = cursor.fetchall()
            return result
    except pymysql.MySQLError as e:
        print(f"Error fetching trades: {e}")
        return None
    finally:
        if conn:
            conn.close()
            print("Database connection closed")


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

            values = (
                body["userId"],
                body["accountNumber"],
                body["tradeLink"],
                body["commodity"],
                body["tradeType"],
                float(body["lotSize"]),
                float(body["entryPrice"]),
                float(body["exitPrice"]),
                body["openDate"],
                body["closeDate"],
                float(body["profitLoss"]),
                float(body["equityBefore"]),
                float(body["equityAfter"]),
                float(body["stopLoss"]),
                float(body["takeProfit"]),
                body["strategy"],
                body["comments"],
                body["tags"],
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
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        # Handle datetime objects if needed
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def lambda_handler(event, context):
    body = event["body"]
    if event["type"] == "add_trade":
        try:

            print(f"Received body: {body}")
            id = insert_data(body)
            if id:
                return {
                    "statusCode": 200,
                    "body": json.dumps(
                        {"message": "Data inserted successfully", "id": id}
                    ),
                }
            else:
                return {
                    "statusCode": 500,
                    "body": json.dumps({"message": "Error inserting data"}),
                }
        except Exception as e:
            print(f"Error in lambda_handler: {e}")
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal server error"}),
            }
    elif event["type"] == "get_trades":
        try:
            userId = body["userId"]
            result = get_trades(userId)
            if result:
                return {
                    "statusCode": 200,
                    "body": json.dumps(
                        {"message": "Trades fetched successfully", "trades": result}, cls=DecimalEncoder
                    ),
                }
            else:
                return {
                    "statusCode": 500,
                    "body": json.dumps({"message": "Error fetching trades"}),
                }
        except Exception as e:
            print(f"Error in lambda_handler: {e}")
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Internal server error"}),
            }


input = {
    "body": {
        "userId": 1,
        "accountNumber": 123456,
        "tradeLink": "http://example.com/trade",
        "commodity": "Gold",
        "tradeType": "Buy",
        "lotSize": 1.0,
        "entryPrice": 1800.50,
        "exitPrice": 1850.75,
        "openDate": "2023-10-01T10:00:00Z",
        "closeDate": "2023-10-02T10:00:00Z",
        "profitLoss": 50.25,
        "equityBefore": 10000.00,
        "equityAfter": 10050.25,
        "stopLoss": 1790.00,
        "takeProfit": 1860.00,
        "strategy": "Scalping",
        "comments": "Good trade",
        "tags": "gold scalping",
        "userID": 1,
    },
    "type": "get_trades",
}

print(lambda_handler(input, {}))
