from sqlalchemy import create_engine, Sequence
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ARRAY

# create a PostgreSQL engine
engine = create_engine('postgresql://jmc:jmc@localhost:5432/links')

# create a session factory
Session = sessionmaker(bind=engine)

# create a base class for declarative models
Base = declarative_base()

# define a simple model
class Links(Base):
    __tablename__ = 'links'
    id = Column(Integer, Sequence('links_id_seq'), primary_key=True)
    Descript = Column(String)
    link = Column(ARRAY(Integer))

# create the table in the database
Base.metadata.create_all(engine)

# create a new link object
new_link = Links(Descript='TESTE', link=[1, 4])

# add the new link to the database
session = Session()
session.add(new_link)
session.commit()

# query the database for all links
links = session.query(Links).all()

# print the results
for link in links:
    print(link.id, link.Descript, link.link)

