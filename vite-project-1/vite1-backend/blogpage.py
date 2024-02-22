# app.py
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline 
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"], "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"]}})
summarization_pipeline = pipeline('summarization', model='facebook/bart-large-cnn')
# Set up MongoDB connection
app.config["MONGO_URI"] = "mongodb+srv://rajdeep:rajdeep2017@omnispectra.j3xzuo0.mongodb.net/OmniSpectra?retryWrites=true&w=majority"
mongo = PyMongo(app)

clickedPostHeading = ""

# Access the specific collection within the database
collection = mongo.db.blogs

@app.route('/get_data_for_python', methods=['GET'])
def get_data_for_python():
    global clickedPostHeading
    # print(f'this is collection: {collection}')
    
    # Fetch data from MongoDB
    data = list(collection.find({}, {'_id': 0}))
    # print(f"this is data @ terminal {data}")
    df = pd.DataFrame(data)
    # print(f'thsi is df : {df}')
    # print(f"this is clicked postt : {clickedPostHeading}")
    
    try:
        # print("Entered the try loop")
        ans = recommend(clickedPostHeading, df)
        # print("Cleared the recommend execution")
        response = jsonify({'data': ans})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        # print(f"this is printed for checking response: {response.data}")
        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

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
        print("Clicked post heading received on server ")
        response = jsonify({'message': 'Clicked heading received successfully'})

    # Add CORS headers
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    
    print(f"Received clickedPostHeading: {clickedPostHeading}")
    return response

@app.route('/summarize', methods=['POST'])
def summarize_text():
    try:
        data = request.get_json()
        text = data['text']

        # Summarize the input text
        summary = summarization_pipeline(text, max_length=150, min_length=50, length_penalty=2.0, num_beams=4)[0]['summary_text']

        return jsonify({'summary': summary})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

def get_recommendation(df):
    cv = CountVectorizer(max_features=5000, stop_words='english')
    # print(f'this is df inside get_recommendation: {df}')
    vectors = cv.fit_transform(df['Category']).toarray()
    similarity = cosine_similarity(vectors)
    return similarity

def recommend(blog, df):

    blog_index = df[df['Heading'] == blog].index[0]
    distances = get_recommendation(df)[blog_index]
    blog_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])
    final_recco = [df.iloc[i[0]].Heading for i in blog_list]
    return final_recco
    # except IndexError:
    #     print(f"Error: No matching rows for blog heading '{blog}'")
    #     return []

if __name__ == '__main__':
    app.run(debug=True, port=5000)
