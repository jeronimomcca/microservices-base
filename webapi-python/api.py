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
    #REALLY IMPORTANT TO RETURN ONLY THE FIELDS THE USER HAS PERMITION TO
    return f"SELECT * from {object_name} WHERE id = {primary_key}"


def execQuery(query):
    cursor.execute(query)
    columns = [desc[0] for desc in cursor.description]
    result = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return result



# def execQuery(query):
#     cursor.execute(query)
#     columns = [desc[0] for desc in cursor.description]
#     data = [dict(zip(columns, row)) for row in cursor.fetchall()]
#     result = {'headers': columns, 'data':data}
#     return result




# -- Table: public.configurations

# -- DROP TABLE public.configurations;

# CREATE TABLE public.configurations
# (
#     id integer NOT NULL,
#     module integer,
#     attribute character varying(50) COLLATE pg_catalog."default",
#     value character varying(5000) COLLATE pg_catalog."default",
#     user_id integer,
#     CONSTRAINT configurations_pkey PRIMARY KEY (id)
# )
# WITH (
#     OIDS = FALSE
# )
# TABLESPACE pg_default;



# -- Table: public.users

# -- DROP TABLE public.users;

# CREATE TABLE public.users
# (
#     id integer NOT NULL,
#     name character varying(50) COLLATE pg_catalog."default" NOT NULL,
#     login character varying(100) COLLATE pg_catalog."default" NOT NULL,
#     password character varying(100) COLLATE pg_catalog."default",
#     views integer[],
#     widgets integer[],
#     CONSTRAINT users_pkey PRIMARY KEY (id)
# )
# WITH (
#     OIDS = FALSE
# )
# TABLESPACE pg_default;

# ALTER TABLE public.users
#     OWNER to postgres;


# -- Table: public.views

# -- DROP TABLE public.views;

# CREATE TABLE public.views
# (
#     id integer NOT NULL,
#     name character varying(50) COLLATE pg_catalog."default" NOT NULL,
#     object character varying(50) COLLATE pg_catalog."default" NOT NULL,
#     delete character varying(50) COLLATE pg_catalog."default",
#     "create" character varying(50) COLLATE pg_catalog."default",
#     get character varying(50) COLLATE pg_catalog."default",
#     update character varying(50) COLLATE pg_catalog."default",
#     query integer[],
#     CONSTRAINT views_pkey PRIMARY KEY (id)
# )
# WITH (
#     OIDS = FALSE
# )
# TABLESPACE pg_default;

# ALTER TABLE public.views
#     OWNER to postgres;



@app.route("/web-app/<query>", methods=['GET'])
def get_web_app(query):
    # dataEntity = json.loads(str(entity))
    # permissions r- read, u- update, c- create, d- delete
    if query == "configuration":
        return json.dumps({
   "views": [
      {
         "name": "Entity",
         "type": "object",
         "object": "entity",
         "delete": "/delete/",
         "create": "/create/",
         "get": "/get/",
         "update": "/update/",
         "query": {
            "object": "entity",
            "filter": [
               "\"isFact\" is not null"
            ],
            "sort": "id"
         },
         "permission": "r"
      },
      {
         "name": "Links",
         "object": "links",
         "delete": "/delete/",
         "create": "/create/",
         "get": "/get/",
         "update": "/update/",
         "type": "object",
         "source": "/get/",
         "query": {
            "object": "links",
            "filter": [

            ],
            "sort": "id"
         },
         "permission": "crud"
      },
      {
         "name": "Views",
         "object": "views",
         "delete": "/delete/",
         "create": "/create/",
         "get": "/get/",
         "update": "/update/",
         "type": "api",
         "query": {
            "object": "views",
            "filter": [],
            "sort": "id"
         },
         "permission": "r"
      },
      {
         "name": "view4",
         "object": "entity",
         "delete": "/delete/",
         "create": "/create/",
         "get": "/get/",
         "update": "/update/",
         "type": "object",
         "source": "/get/",
         "query": {
            "object": "entity",
            "filter": [
               "\"isFact\" = false"
            ],
            "sort": "id"
         },
         "permission": "crud"
      }
   ],
   "widgets": [
      "clock",
      "user"
   ]
})

@app.route("/get/<query>", methods=['GET'])
def get_query_result(query):
    # Decode and parse the query string
    try:
        json_obj = json.loads(unquote(query))
    except json.JSONDecodeError:
        return "Invalid JSON input"

    # Extract the properties from the JSON object
    object_name = json_obj.get('object')
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

    print("======================= {}".format(results))
    return json.dumps(results)

    

@app.route("/update/<object>", methods=['GET'])
def update_query_result(object):
    decoded_query = unquote(object)
    update_data = json.loads(decoded_query)
    object_name = update_data["object"]
    del update_data["object"]
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


    #REALLY IMPORTANT TO RETURN ONLY THE FIELDS THE USER HAS PERMITION TO
    select_query = create_query_based_on_user_permitions(object_name, primary_key, "default")
    
    
    return json.dumps( execQuery(select_query) )





@app.route("/delete/<object>", methods=['GET'])
def delete_query_result(object):
    decoded_query = unquote(object)
    delete_data = json.loads(decoded_query)
    object_name = delete_data["object"]
    primary_key = delete_data["id"]

    # Build the SQL DELETE statement
    query = f"DELETE from {object_name} WHERE id = {primary_key}"

    # Execute the UPDATE statement
    cursor.execute(query)
    connection.commit()
    return json.dumps(delete_data)


@app.route("/create/<query>", methods=['GET'])
def create_query_result(query):
    # need to convert URL-encoded string
    # curl -X GET http://localhost:10000/get/%7B%22name%22%3A%20%22John%22%2C%20%22age%22%3A%2030%7D

    decoded_query = unquote(query)

    json_obj = json.loads(decoded_query)
      # Extract the object name from the JSON object
    object_name = json_obj.get('object')
    del json_obj["object"]

    primary_key = json_obj.get('id')

    # Build the SQL statement to insert a new row
    keys = []
    values = []
    for key, value in json_obj.items():
        keys.append("\"{}\"".format(key))
        values.append(escape_sql_value(value))
    query = f"INSERT INTO {object_name} ({','.join(keys)}) VALUES ({','.join(values)})"

    # Execute the SQL statement
    cursor.execute(query)

    # Commit the transaction and close the connection
    connection.commit()

        #REALLY IMPORTANT TO RETURN ONLY THE FIELDS THE USER HAS PERMITION TO
    select_query = create_query_based_on_user_permitions(object_name, primary_key, "default")
    
    
    return json.dumps( execQuery(select_query) )



@app.route("/createantigo/<entity>", methods=['GET', 'POST'])
def create_generic_obj(entity):
    dataEntity = json.loads(str(entity))
    obj = dataEntity["ObjName"]
    print("chamou /create/{}".format(str(dataEntity)))
    selectDataTypeQuery = "SELECT TABLE_CATALOG,TABLE_SCHEMA,TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS where table_name = '" + obj + "';"
    tableInfo = execQuery(selectDataTypeQuery)
    columnInQuotes = {}
    for col in tableInfo:
        columnInQuotes[col[3]] = col[4] != 'boolean' and col[4] != 'integer'

    insertQuery = "INSERT INTO " + dataEntity["ObjName"] + "("
    for prop in dataEntity:
        if prop != "ObjName":
            insertQuery = insertQuery + "\"{}\", ".format(prop)
    insertQuery = insertQuery[:-2] + ") VALUES ("

    for prop in dataEntity:
        value = dataEntity[prop]
        if prop != "ObjName":
            valueCorrection = value if not columnInQuotes[prop] else "'{}'".format(
                value)
            insertQuery = insertQuery + valueCorrection + ", "
    insertQuery = insertQuery[:-2] + ");"

    # cursor.execute(insertQuery)
    # connection.commit()

    print("Insert query => {}".format(insertQuery))

    # Tive que remover para permitir chamar com id_seq
    # validateQuery = "select json_agg(" + obj + ".* order by " + obj + ".\"Descript\" ) from " + obj + " where "
    # for prop in dataEntity:
    #     if prop != "ObjName":
    #         value = dataEntity[prop]
    #         valueCorrection =  value if not columnInQuotes[prop] else "'{}'".format(value)
    #         validateQuery = validateQuery + "\"{}\" = {} and ".format(prop, valueCorrection)
    # validateQuery = validateQuery[:-4] + ";"
    # print("Validate query => {}".format(validateQuery))

    # execQuery(validateQuery)

    # return json.dumps( execQuery(validateQuery) )
    return "Success"


@app.route("/editantigo/<entity>", methods=['GET', 'POST'])
def edit_generic_obj(entity):
    dataEntity = json.loads(str(entity))
    obj = dataEntity["ObjName"]
    conditionLabel = 'condition'
    print("chamou /edit/{}".format(str(dataEntity)))
    selectDataTypeQuery = "SELECT TABLE_CATALOG,TABLE_SCHEMA,TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS where table_name = '" + obj + "';"
    tableInfo = execQuery(selectDataTypeQuery)
    columnInQuotes = {}
    for col in tableInfo:
        columnInQuotes[col[3]] = col[4] != 'boolean' and col[4] != 'integer'

    updateQuery = "UPDATE " + dataEntity["ObjName"] + " set "

    for prop in dataEntity:
        value = dataEntity[prop]
        if prop != "ObjName" and prop != conditionLabel and value != None:
            valueCorrection = value if not columnInQuotes[prop] else "'{}'".format(
                value)
            updateQuery = updateQuery + \
                "\"{}\" = {}, ".format(prop, valueCorrection)
    updateQuery = updateQuery[:-2] + \
        " where \"Descript\" = '{}';".format(dataEntity[conditionLabel])

    print("Insert query => {}".format(updateQuery))
    # cursor.execute(updateQuery)
    # connection.commit()

    return "Success"


@app.route("/deleteantigo/<entity>", methods=['GET', 'POST'])
def delete_generic_obj(entity):
    dataEntity = json.loads(str(entity))
    obj = dataEntity["ObjName"]
    conditionLabel = 'condition'
    print("chamou /delete/{}".format(str(dataEntity)))
    selectDataTypeQuery = "SELECT TABLE_CATALOG,TABLE_SCHEMA,TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS where table_name = '" + obj + "';"
    tableInfo = execQuery(selectDataTypeQuery)
    columnInQuotes = {}
    for col in tableInfo:
        columnInQuotes[col[3]] = col[4] != 'boolean' and col[4] != 'integer'

    updateQuery = "DELETE from " + dataEntity["ObjName"] + " where "

    for prop in dataEntity:
        value = dataEntity[prop] if type(dataEntity[prop]).__name__ != 'list' else str(
            dataEntity[prop]).replace("[", "{").replace("]", "}")
        if prop != "ObjName" and prop != conditionLabel and value != None:
            valueCorrection = value if not columnInQuotes[prop] else "'{}'".format(
                value)
            updateQuery = updateQuery + \
                "\"{}\" = {} and ".format(prop, valueCorrection)
    updateQuery = updateQuery[:-4] + ";"

    print("Insert query => {}".format(updateQuery))
    # cursor.execute(updateQuery)
    # connection.commit()

    return "Success"


# @app.route("/get/links/<obj>" ,methods=['GET'])
# def get_linked_cluster(obj):
#     query1 = "select match, replace( replace(array_agg(link)::text, '{', '' ), '}', '' )  from (SELECT link, 1 as \"match\" FROM public.links where " + str(obj) + "  = any(link) ) as relacoes GROUP  BY match;"
#     cursor.execute(query1)
#     result1 = cursor.fetchone()
#     obj1 = result1[1] if result1 else []
#     connection.commit()
#     if obj1:
#         query2 = "select json_agg( DISTINCT \"Descript\" order by \"Descript\") from entity where id in (" + obj1 + ");"
#         print(query2)
#         cursor.execute(query2)
#         result = cursor.fetchone()
#         print(result[0])
#         return str(result[0])
#     return "[]"


# @app.route("/<obj>/get/" ,methods=['GET'])
# def get_generic(obj):
#     query =  "select json_agg(" + obj + ".* order by " + obj + ".\"Descript\" ) from " + obj + ";"
#     print(query)
#     cursor.execute(query)
#     result = cursor.fetchone()
#     print(result[0])
#     return json.dumps(result[0])

# @app.route("/get/all/obj" ,methods=['GET'])
# def get_all_obj():
#     query =  "SELECT json_agg(table_name order by 1) FROM information_schema.tables where table_schema = 'public';"
#     print(query)
#     cursor.execute(query)
#     result = cursor.fetchone()
#     print(result[0])
#     return json.dumps(result[0])

# @app.route("/get/all/columns/<obj>" ,methods=['GET'])
# def get_all_columns_for_obj(obj):
#     query =  "select json_agg(column_name  order by 2) from information_schema.columns where table_name = '"+ obj + "';"
#     print(query)
#     cursor.execute(query)
#     result = cursor.fetchone()
#     print(result[0])
#     return json.dumps(result[0])

# @app.route("/entity/edit/<entity>" ,methods=['GET', 'POST'])
# def edit_entity(entity):
#     dataEntity = json.loads(str(entity))
#     print(dataEntity)
#     if (dataEntity["LocatedAt"] == "None"):
#         dataEntity["LocatedAt"] = "NULL"
#     query = "UPDATE entity SET \"Descript\" = '{}', \"isFact\" = {}, \"LocatedAt\" = {} WHERE \"id\" = {};".format(dataEntity["Descript"], dataEntity["isFact"], dataEntity["LocatedAt"], dataEntity["id"])
#     print(query)
#     cursor.execute(query)
#     connection.commit()

#     cursor.execute("select * from entity where \"Descript\" = '" + dataEntity["Descript"]  + "';")

#     return str( cursor.fetchone() )


# @app.route("/entity/get/<entity_id>" ,methods=['GET'])
# def get_entity(entity_id):
#     print(entity_id)
#     query =  "select * from entity where id = {};".format(entity_id)
#     print(query)
#     cursor.execute(query)

#     return str( cursor.fetchall() )
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
