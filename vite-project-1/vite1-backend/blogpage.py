# app.py
from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/get_data_for_python": {"origins": "http://localhost:5173"}})
# Set up MongoDB connection
app.config["MONGO_URI"] = "mongodb+srv://rajdeep:rajdeep2017@omnispectra.j3xzuo0.mongodb.net/OmniSpectra?retryWrites=true&w=majority"
mongo = PyMongo(app)

@app.route('/get_data_for_python', methods=['GET'])
def get_data_for_python():
    # Replace 'your_collection_name' with the actual name of your MongoDB collection
    collection = mongo.db.BlogData

    # Fetch data from MongoDB
    data = list(collection.find({}, {'_id': 0}))

    return jsonify({'data': data})
    # return "hi "

if __name__ == '__main__':
    app.run(debug=True, port=5000)


















# from flask import Flask, jsonify, request
# from pymongo import MongoClient
# import pandas as pd 
# import re
# app = Flask(__name__)

# # Replace with your MongoDB connection details
# client = MongoClient("mongodb+srv://rajdeep:rajdeep2017@omnispectra.j3xzuo0.mongodb.net/OmniSpectra?retryWrites=true&w=majority")
# db = client["OmniSpectra"]
# collection = db["OmniSpectra"]


# @app.route("/blogdata")
# def get_blog_posts():
#     page = int(request.args.get("page", 1))
#     per_page = 10  # Adjust as needed
#     skip = (page - 1) * per_page
#     posts = list(collection.find().skip(skip).limit(per_page))

#     # Filter posts based on search input
#     search_input = request.args.get("search", "").lower()
#     if search_input:
#         posts = [
#             post for post in posts if search_input in post["Content"].lower()
#         ]

#     # Prepare data for frontend
#     for post in posts:
#         post["getFirstImageUrl"] = lambda: getFirstImageUrl(post["Content"])
#         del post["_id"]  # Remove unnecessary field
#     return jsonify({"posts": posts, "hasMore": len(posts) == per_page})


# def getFirstImageUrl(content):
#     # Extract the first image URL from content or return None
#     match = re.search(r'<img src="(.*?)"', content)
#     return match.group(1) if match else None

