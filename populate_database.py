from roco.library import build_database, filter_components, get_component, query_database

def populate_database():
    build_database(filter_components())


if __name__ == '__main__':
    populate_database()
