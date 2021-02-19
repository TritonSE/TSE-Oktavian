import pymongo
import argparse
import os

from bson.objectid import ObjectId

from dotenv import load_dotenv
load_dotenv()


def change_role(email, roles):
    uri = os.getenv('MONGO_URI')
    if uri is None:
        uri = 'mongodb://127.0.0.1:27017/tse-recruitment'
    components = pymongo.uri_parser.parse_uri(uri)
    client = pymongo.MongoClient(uri)
    db = client[components['database']]

    user = db.users.find_one({'email': email})
    if user is None:
        raise Exception('User doesn\'t exist')

    # for every role in the UserCategory collection, remove the user
    db.usercategories.update_many({},
                                  {'$pull': {'users': ObjectId(user['_id'])}})

    # for every role in roles, add the user to that role
    matchedCount = db.usercategories.update_many({'role': {'$in': roles}}, {
        '$push': {'users': ObjectId(user['_id'])}}).matched_count

    if matchedCount < len(roles):
        raise Exception('Invalid role input')


def main():
    parser = argparse.ArgumentParser("Dynamically set a user's roles,"
                                     "overriding any personal preferences")
    parser.add_argument('email', metavar='email', type=str,
                        help='the user\'s email')
    parser.add_argument('roles', metavar='roles', type=str, nargs='*',
                        help='the roles of the user')

    args = parser.parse_args()
    change_role(args.email, args.roles)


if __name__ == '__main__':
    main()
