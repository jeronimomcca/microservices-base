#!/usr/bin/python3

# Open a terminal or command prompt.
# Navigate to the directory that contains your project.
# Execute the command to run your tests. The command may differ depending on your specific testing framework. For example, if you are using pytest, you can simply run pytest to discover and run your tests.
# Here is an example command to run unit tests using the built-in unittest module in Python:
# python -m unittest discover tests

# cd tests
# python -m unittest api_test.TestAPI.test_create_entity
# cd ..
# python -m unittest discover -s tests -p "*test.py"


import json
import unittest
import requests
from urllib.parse import urlencode
import time
from sqlalchemy import create_engine, Sequence
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ARRAY, Boolean

# create a PostgreSQL engine
engine = create_engine('postgresql://jmc:jmc@localhost:5432/links')

# create a session factory
Session = sessionmaker(bind=engine)

# create a base class for declarative models
Base = declarative_base()

# define a simple model
class Entity(Base):
    __tablename__ = 'entity'
    id = Column(Integer, Sequence('entity_id_seq'), primary_key=True)
    Descript = Column(String)
    isFact = Column(Boolean)

# create the table in the database
Base.metadata.create_all(engine)
session = Session()



class TestAPI(unittest.TestCase):
    def setUp(self):
        # app.testing = True
        # requests = app.test_client()
        # db.create_all()
        print("setUp")

    def tearDown(self):
        # session.remove()
        # db.drop_all()
        print("tearDown")

    def test_create_entity(self):
        data = {
            'Descript': 'Test Create Entity',
            'isFact': True,
            'id': 654321

        }
        response = requests.post('http://localhost:10000/create/entity/', json=data,  headers={'Content-Type': 'application/json'})
        my_created_obj = session.query(Entity).filter_by(id=data["id"]).first()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(my_created_obj.Descript, data["Descript"])
        session.delete(my_created_obj)
        session.commit()


    def test_get_entity(self):
        entity = Entity(Descript='Test Get Entity', isFact=True)
        session.add(entity)
        session.commit()
        filterObj = {"filter": ["\"id\" = {}".format(entity.id)] }
        filterStr = json.dumps(filterObj)
        response = requests.get(f'http://localhost:10000/get/entity/{filterStr}')
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"][0]
        self.assertEqual(data['Descript'], 'Test Get Entity')
        self.assertEqual(data['isFact'], True)
        session.delete(entity)
        session.commit()

    def test_update_entity(self):
        entity = Entity(Descript='Test update Entity', isFact=True)
        session.add(entity)
        session.commit()
        data = {
            'isFact': False,
            'id': entity.id
        }
        response = requests.post('http://localhost:10000/update/entity/', json=data,  headers={'Content-Type': 'application/json'})
        time.sleep(1)
        session.refresh(entity)
        updated_entity = entity
        self.assertEqual(response.status_code, 200)
        self.assertEqual(updated_entity.isFact, False)
        session.delete(entity)
        session.commit()

    def test_delete_entity(self):
        entity = Entity(Descript='Test Delete Entity', isFact=True)
        session.add(entity)
        session.commit()
        response = requests.post('http://localhost:10000/delete/entity/', json={'id': entity.id},  headers={'Content-Type': 'application/json'})
        self.assertEqual(response.status_code, 200)
        deleted_entity = session.query(Entity).filter_by(id=entity.id).first()
        self.assertIsNone(deleted_entity)


if __name__ == '__main__':
    unittest.main()