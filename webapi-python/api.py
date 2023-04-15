#!/usr/bin/python3


# mudar retorno para json.dumps ao inves de str


# with firstSelect as
# (select lnk."Descript" as Coment, ent.*, lnk.link from links lnk left join entity ent on ent.id = ANY( lnk.link ) )
# select * from firstSelect fsel left join entity ent on (ent.id = any(fsel.link) and ent."Descript" <> fsel."Descript")


import json
import psycopg2
from flask import Flask, request
from flask_cors import CORS
from urllib.parse import unquote

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


def escape_sql_value(value):
    """
    Escape a value for use in a SQL statement, depending on its type.
    """
    if value is None:
        return "NULL"
    elif isinstance(value, bool):
        return str(value)
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, list):
        escaped_values = [escape_sql_value(v) for v in value]
        return f"ARRAY[{','.join(escaped_values)}]"
    else:
        return f"'{value}'"


def create_query_based_on_user_permitions(object_name, primary_key, user):
    # REALLY IMPORTANT TO RETURN ONLY THE FIELDS THE USER HAS PERMITION TO
    return f"SELECT * from {object_name} WHERE id = {primary_key}"


def execQuery(query):
    cursor.execute(query)
    columns = [desc[0] for desc in cursor.description]
    data = [dict(zip(columns, row)) for row in cursor.fetchall()]
    result = {'headers': columns, 'data': data}
    return result

@app.route("/web-app/<query>", methods=['GET'])
def get_web_app(query):
    # permissions r- read, u- update, c- create, d- delete
    if query == "configuration":
        views_query = "select * from views"
        result = execQuery(views_query)
        views = result.get("data")
        for view in views:
            view["object"] = view["table_name"]
            view["query"] = { "object": view["table_name"], "sort": "id" }

    print(views)

    return json.dumps( {"views": views})


    # return json.dumps({
    #     "views": [
    #         {
    #             "name": "Entity",
    #             "type": "object",
    #             "object": "entity",
    #             "delete": "/delete/",
    #             "create": "/create/",
    #             "get": "/get/",
    #             "update": "/update/",
    #             "query": {
    #                 "object": "entity",
    #                 "filter": [
    #                     "\"isFact\" is not null"
    #                 ],
    #                 "sort": "id"
    #             },
    #             "permission": "r"
    #         }
    #     ],
    #     "widgets": [
    #         "clock",
    #         "user"
    #     ]
    # })


@app.route("/get/<object>/<query>", methods=['GET'])
def get_query_result(object, query):
    # Decode and parse the query string
    try:
        json_obj = json.loads(unquote(query))
    except json.JSONDecodeError:
        return "Invalid JSON input"

    # Extract the properties from the JSON object
    object_name = object
    filter_list = json_obj.get('filter', [])
    sort_criteria = json_obj.get('sort', '')

    # Build the SQL query based on the JSON object properties
    query = f"SELECT * FROM {object_name}"
    if filter_list:
        filters = " AND ".join(filter_list)
        query += f" WHERE {filters}"
    if sort_criteria:
        query += f" ORDER BY \"{sort_criteria}\""

    # Execute the SQL query and fetch the results
    results = execQuery(query)

    return json.dumps(results)


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
    return json.dumps(execQuery(select_query))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
