from roco.library import build_database, filter_components, get_component, query_database
import pdb

def populate_database():
    build_database(filter_components())

pdb.set_trace()

if __name__ == '__main__':
    populate_database()
