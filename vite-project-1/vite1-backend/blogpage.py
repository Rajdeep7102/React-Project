from flask import Flask, jsonify, request
from pymongo import MongoClient
import re
app = Flask(__name__)

# Replace with your MongoDB connection details
client = MongoClient("mongodb+srv://rajdeep:rajdeep2017@omnispectra.j3xzuo0.mongodb.net/OmniSpectra?retryWrites=true&w=majority")
db = client["OmniSpectra"]
collection = db["OmniSpectra"]


@app.route("/blogdata")
def get_blog_posts():
    page = int(request.args.get("page", 1))
    per_page = 10  # Adjust as needed
    skip = (page - 1) * per_page
    posts = list(collection.find().skip(skip).limit(per_page))

    # Filter posts based on search input
    search_input = request.args.get("search", "").lower()
    if search_input:
        posts = [
            post for post in posts if search_input in post["Content"].lower()
        ]

    # Prepare data for frontend
    for post in posts:
        post["getFirstImageUrl"] = lambda: getFirstImageUrl(post["Content"])
        del post["_id"]  # Remove unnecessary field

def getFirstImageUrl(content):
    # Extract the first image URL from content or return None
    match = re.search(r'<img src="(.*?)"', content)
    return match.group(1) if match else None

    return jsonify({"posts": posts, "hasMore": len(posts) == per_page})
