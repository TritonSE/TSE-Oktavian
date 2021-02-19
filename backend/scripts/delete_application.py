import pymongo
import argparse
import os

from bson.objectid import ObjectId

from dotenv import load_dotenv
load_dotenv()

def delete_application(app_id):
    
    # Connects to database
    uri = os.getenv('MONGO_URI')
    if uri is None:
        uri = 'mongodb://127.0.0.1:27017/tse-recruitment'
    components = pymongo.uri_parser.parse_uri(uri)
    client = pymongo.MongoClient(uri)
    db = client[components['database']]

    # Checks if application exists
    app = db.application.find_one({'_id': ObjectId(app_id)})
    if app is None:
        raise Exception('Application doesn\'t exist')

    # Deletes the application
    db.applications.delete_one({'_id': ObjectId(app_id)})

    # Deletes the associated reviews
    db.reviews.delete_many({'application': ObjectId(app_id)})

def main():
    parser = argparse.ArgumentParser('Delete application along with associated reviews')
    parser.add_argument('app_id', metavar='app_id', type=str,
            help='the application\'s id')

    args = parser.parse_args()
    delete_application(args.app_id)

if __name__ == '__main__':
    main()
