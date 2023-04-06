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




# from flask import Flask, jsonify
# from sqlalchemy import create_engine, Column, Integer, String, Boolean
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# app = Flask(__name__)

# # Cria conexão com o banco de dados usando o SQLAlchemy
# engine = create_engine('sqlite:///database.db')
# Session = sessionmaker(bind=engine)
# Base = declarative_base()

# # Cria classe Entity que mapeia a tabela no banco de dados
# class Entity(Base):
#     __tablename__ = 'entity'
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     isFact = Column(Boolean)

# # Define a rota /get/<query> que recebe um objeto JSON como query
# @app.route('/get/<query>')
# def get_data(query):
#     session = Session()

#     # Converte o objeto JSON em um dicionário Python
#     query_dict = json.loads(query)

#     # Obtém os valores do objeto de query
#     object_name = query_dict['object']
#     filters = query_dict['filter']
#     sort_by = query_dict['sort']

#     # Cria uma query usando o SQLAlchemy para buscar os registros correspondentes
#     query = session.query(Entity).filter(*filters).order_by(sort_by)

#     # Converte os resultados da query em um dicionário Python
#     results = []
#     for record in query:
#         result = {'id': record.id, 'name': record.name, 'isFact': record.isFact}
#         results.append(result)

#     # Retorna os resultados em formato JSON
#     return jsonify(results)

# if __name__ == '__main__':
#     Base.metadata.create_all(engine)
#     app.run(debug=True)





# from sqlalchemy.orm import sessionmaker

# def buscar_objetos(nome_tabela):
#     # Cria uma nova sessão
#     Session = sessionmaker(bind=engine)
#     session = Session()

#     # Faz a busca usando a função query()
#     objetos = session.query(eval(nome_tabela)).all()

#     # Retorna a lista de objetos
#     return objetos
