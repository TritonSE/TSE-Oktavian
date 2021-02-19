import pymongo
import argparse
import os

from collections import defaultdict

from dotenv import load_dotenv
load_dotenv()


def view_roles():
    uri = os.getenv('MONGO_URI')
    if uri is None:
        uri = 'mongodb://127.0.0.1:27017/tse-recruitment'
    components = pymongo.uri_parser.parse_uri(uri)
    client = pymongo.MongoClient(uri)
    db = client[components['database']]

    user_roles = defaultdict(list)
    for category in db.usercategories.find():
        role = category['role']
        for uid in category['users']:
            user_roles[uid].append(role)

    for user in db.users.find():
        uid = user['_id']
        roles = user_roles[uid]
        print("{} ({}): {}".format(user['name'], user['email'], ', '.join(roles)))


def main():
    parser = argparse.ArgumentParser("List all users in the database,"
                                     "along with what roles they belong to")
    parser.parse_args()
    view_roles()


if __name__ == '__main__':
    main()
