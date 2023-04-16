#!/usr/bin/python3


# mudar retorno para json.dumps ao inves de str


# with firstSelect as
# (select lnk."Descript" as Coment, ent.*, lnk.link from links lnk left join entity ent on ent.id = ANY( lnk.link ) )
# select * from firstSelect fsel left join entity ent on (ent.id = any(fsel.link) and ent."Descript" <> fsel."Descript")


# Code	Meaning	Description
# 200	OK	The requested action was successful.
# 201	Created	A new resource was created.
# 202	Accepted	The request was received, but no modification has been made yet.
# 204	No Content	The request was successful, but the response has no content.
# 400	Bad Request	The request was malformed.
# 401	Unauthorized	The client is not authorized to perform the requested action.
# 404	Not Found	The requested resource was not found.
# 415	Unsupported Media Type	The request data format is not supported by the server.
# 422	Unprocessable Entity	The request data was properly formatted but contained invalid or missing data.
# 500	Internal Server Error	The server threw an error when processing the request.
# These ten status codes represent only a small subset of the available HTTP status codes. Status codes are numbered based on the category of the result:

# Code range	Category
# 2xx	Successful operation
# 3xx	Redirection
# 4xx	Client error
# 5xx	Server error


import json
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import unquote
from sqlalchemy import create_engine, Sequence
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ARRAY
from models import Entity, Links, Base, ObjectMap, CustomJSONEncoder

###################                         ALCHEMY
# create a PostgreSQL engine
engine = create_engine('postgresql://jmc:jmc@localhost:5432/links')

# create a session factory
Session = sessionmaker(bind=engine)

# create a base class for declarative models
Base = declarative_base()

# create the table in the database
Base.metadata.create_all(engine)

# add the new link to the database
session = Session()


###################                         FLASK

app = Flask(__name__)
CORS(app)

connection = psycopg2.connect(user="jmc",
                              password="jmc",
                              host="127.0.0.1",
                              port="5432",
                              database="links")

cursor = connection.cursor()

# Print PostgreSQL Connection properties
print(connection.get_dsn_parameters(), "\n")


def home():
    resp = flask.Response("Foo bar baz")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route("/")
def hello():
    return "It works!"


def create_query_based_on_user_permitions(object_name, primary_key, user):
    # REALLY IMPORTANT TO RETURN ONLY THE FIELDS THE USER HAS PERMITION TO
    return f"SELECT * from {object_name} WHERE id = {primary_key}"


def execQuery(object,query):
    # Get the model class from the object string
    # Check if the object name is valid
    if object not in ObjectMap.object_map:
        return jsonify({'error': f'Invalid object name: {object}'}), 400

    # Get the class corresponding to the object name
    cls = ObjectMap.object_map[object]

    # Query the database
    results = session.query(cls).all()
    return results


@app.route("/get/<object>/<query>", methods=['GET'])
def get_query_result(object, query):


    # Return the results as JSON
    results = execQuery(object,query)

    return json.dumps([result.__dict__ for result in results], cls=CustomJSONEncoder)

    # # Decode and parse the query string
    # try:
    #     print(unquote(query))
    #     json_obj = json.loads(unquote(query))
    # except json.JSONDecodeError:
    #     return "Invalid JSON input"

    # # Extract the properties from the JSON object
    # object_name = object
    # filter_list = json_obj.get('filter', [])
    # sort_criteria = json_obj.get('sort', '')

    # # Build the SQL query based on the JSON object properties
    # query = f"SELECT * FROM {object_name}"
    # if filter_list:
    #     filters = " AND ".join(filter_list)
    #     query += f" WHERE {filters}"
    # if sort_criteria:
    #     query += f" ORDER BY \"{sort_criteria}\""

    # # Execute the SQL query and fetch the results
    # results = execQuery(query)

    # return json.dumps(results)


@app.route("/update/<object>/", methods=['POST'])
def update_query_result(object):
    update_data = request.json
    object_name = object

    primary_key = update_data["id"]

    # validate object_name

    # Check permissions

    print(update_data)

    # Convert the update data to a SQL SET clause
    set_clause = ", ".join(
        [f"\"{key}\" = {escape_sql_value(val)}" for key, val in update_data.items()])

    # Build the SQL UPDATE statement
    query = f"UPDATE {object_name} SET {set_clause} WHERE id = {primary_key}"

    # Execute the UPDATE statement
    cursor.execute(query)
    connection.commit()

    # REALLY IMPORTANT TO RETURN ONLY THE FIELDS THE USER HAS PERMITION TO
    select_query = create_query_based_on_user_permitions(
        object_name, primary_key, "default")

    return json.dumps(execQuery(select_query))


@app.route("/delete/<object>/", methods=['POST'])
def delete_query_result(object):
    delete_data = request.json
    object_name = object
    primary_key = delete_data["id"]

    # Build the SQL DELETE statement
    query = f"DELETE from {object_name} WHERE id = {primary_key}"

    # Execute the UPDATE statement
    cursor.execute(query)
    connection.commit()
    return json.dumps(delete_data)


@app.route("/create/<object>/", methods=['POST'])
def create_query_result(object):
    # need to convert URL-encoded string
    # curl -X GET http://localhost:10000/get/%7B%22name%22%3A%20%22John%22%2C%20%22age%22%3A%2030%7D

    json_obj = request.json
    # Extract the object name from the JSON object
    object_name = object

    primary_key = json_obj.get('id')

    # Build the SQL statement to insert a new row
    keys = []
    values = []
    for key, value in json_obj.items():
        keys.append("\"{}\"".format(key))
        values.append(escape_sql_value(value))
    query = f"INSERT INTO {object_name} ({','.join(keys)}) VALUES ({','.join(values)})"

    print(query)
    # Execute the SQL statement
    cursor.execute(query)

    # Commit the transaction and close the connection
    connection.commit()

    # REALLY IMPORTANT TO RETURN ONLY THE FIELDS THE USER HAS PERMITION TO
    select_query = create_query_based_on_user_permitions(
        object_name, primary_key, "default")

    print(select_query)
    return json.dumps(execQuery(select_query)), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
