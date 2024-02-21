# app.py
from flask import Flask, jsonify,request,g
from flask_pymongo import PyMongo
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
# Set up MongoDB connection
app.config["MONGO_URI"] = "mongodb+srv://rajdeep:rajdeep2017@omnispectra.j3xzuo0.mongodb.net/OmniSpectra?retryWrites=true&w=majority"
mongo = PyMongo(app)
clickedPostHeading = ""

@app.route('/get_data_for_python', methods=['GET'])
def get_data_for_python():
    global clickedPostHeading
    collection = mongo.db.BlogData
    # clicked_blog_heading = request.args.get('clicked_blog_heading', '')
    
    # Fetch data from MongoDB
    data = list(collection.find({}, {'_id': 0}))
    df = pd.DataFrame(data)
    print(clickedPostHeading)
    ans = recommend(clickedPostHeading,df)
    print(f"these are the reccos {ans}")

    response =  jsonify({'data': ans})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    return response
    # return "hi "

@app.route('/send_clicked_heading', methods=['POST'])
def send_clicked_heading():
    global clickedPostHeading
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'message': 'Preflight request handled successfully'})
    else:
        # Handle POST request
        data = request.json
        clickedPostHeading = data.get('data', '')
        response = jsonify({'message': 'Clicked heading received successfully'})

    # Add CORS headers
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    
    data = request.json
    clickedPostHeading = data.get('data', '')
    print(f"Received clickedPostHeading: {clickedPostHeading}")
    return response
    
   

def get_recommendation(df):
    cv = CountVectorizer(max_features=5000,stop_words='english')
    vectors = cv.fit_transform(df['Category']).toarray()
    similarity = cosine_similarity(vectors)
    return similarity



def recommend(blog,df):
    blog_index = df[df['Heading'] == blog].index[0]
    distances = get_recommendation(df)[blog_index]
    blog_list = sorted(list(enumerate(distances)),reverse=True , key=lambda x:x[1])[1:3]
    final_recco = []
    for i in blog_list:
        final_recco.append(df.iloc[i[0]].Heading)
    return final_recco


if __name__ == '__main__':
    app.run(debug=True, port=5000)
