import pymongo
import argparse
import os

from bson.objectid import ObjectId

from dotenv import load_dotenv
load_dotenv()

def reassign_application(app_id, email):

    # Connects to database
    uri = os.getenv('MONGO_URI')
    if uri is None:
        uri = 'mongodb://127.0.0.1:27017/tse-recruitment'
    components = pymongo.uri_parser.parse_uri(uri)
    client = pymongo.MongoClient(uri)
    db = client[components['database']]

    # Gets user id from email if valid
    user = db.users.find_one({'email': email})
    if user is None:
        raise Exception('User doesn\'t exist')
    user_id = user['_id']

    # Checks if application id is valid
    incomplete_review = db.reviews.find_one({'completed': False, 'application': ObjectId(app_id)})
    complete_review = db.reviews.find_one({'completed': True, 'application': ObjectId(app_id)})
    if incomplete_review is None:
        if complete_review:
            raise Exception('Application is already complete')
        else:
            raise Exception('Application doesn\'t exist')

    # Updates review record for given application id
    db.reviews.update_one({'completed': False, 'application': ObjectId(app_id)}, 
            {'$set': {'reviewer': user_id}})

def main():
    parser = argparse.ArgumentParser('Reassign application to new reviewer')
    parser.add_argument('app_id', metavar='app_id', type=str,
            help='the application\'s id')
    parser.add_argument('email', metavar='email', type=str,
            help='the user\'s email')

    args = parser.parse_args()
    reassign_application(args.app_id, args.email)

if __name__ == '__main__':
    main()
