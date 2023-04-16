from sqlalchemy import  Column, Integer, String, Table, ForeignKey, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm.state import InstanceState
from sqlalchemy.orm import relationship

import json

Base = declarative_base()

entity_links = Table('entity_links', Base.metadata,
    Column('entity_id_1', Integer, ForeignKey('entity.id')),
    Column('entity_id_2', Integer, ForeignKey('entity.id')),
    Column('Descript', String(500)),
    Column('id', Integer, primary_key=True)
)

class Entity(Base):
    __tablename__ = 'entity'
    id = Column(Integer, primary_key=True)
    Descript = Column(String)
    isFact = Column(Integer)
    LocatedAt = Column(String)
    related_entities = relationship('Entity', secondary=entity_links,
        primaryjoin=id==entity_links.c.entity_id_1,
        secondaryjoin=id==entity_links.c.entity_id_2)

class Links(Base):
    __tablename__ = 'links'
    id = Column(Integer, primary_key=True)
    Descript = Column(String)
    link = Column(ARRAY(Integer))
 
class Views(Base):
    __tablename__ = 'views'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    tableName = Column(String)
    delete = Column(String)
    create = Column(String)
    get = Column(String)
    update = Column(String)
    query = Column(String)

class Configurations(Base):
    __tablename__ = 'configurations'
    id = Column(Integer, primary_key=True)
    module = Column(String)
    attribute = Column(String)
    value = Column(String)


class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name     = Column(String)
    login    = Column(String)
    password = Column(String)
    views    = Column(ARRAY(Integer))
    widgets  = Column(ARRAY(Integer))


class ObjectMap:
    object_map = {
        'entity': Entity,
        'links': Links,
        'views': Views,
        'configurations': Configurations,
        'users': Users
    }


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, InstanceState):
            return None
        return super().default(obj)