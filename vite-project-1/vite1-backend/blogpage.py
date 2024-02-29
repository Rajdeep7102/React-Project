# app.py
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_cors import cross_origin
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# from transformers import pipeline 
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"], "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"]}})
# summarization_pipeline = pipeline('summarization', model='facebook/bart-large-cnn')
# Set up MongoDB connection
app.config["MONGO_URI"] = "mongodb+srv://rajdeep:rajdeep2017@omnispectra.j3xzuo0.mongodb.net/OmniSpectra?retryWrites=true&w=majority"
mongo = PyMongo(app)

clickedPostHeading = ""

# Access the specific collection within the database
collection = mongo.db.blogs
userhistories_collection_name = mongo.db.userhistories

def fetch_data_from_mongodb(collection_name):
    cursor = collection_name.find({})
    data = list(cursor)
    # print(f"this is collection {cursor}")
    a = pd.json_normalize(data)
    # print(f"this is data from collection {a}")
    return pd.json_normalize(data)
@app.route('/get_data_for_python', methods=['GET'])
def get_data_for_python():
    global clickedPostHeading
    # print(f'this is collection: {collection}')
    
    # Fetch data from MongoDB
    data = list(collection.find({}, {'_id': 0}))
    # print(f"this is data @ terminal {data}")
    df = pd.DataFrame(data)
    # print(df.head())
    # print(f'thsi is df : {df}')
    # print(f"this is clicked postt : {clickedPostHeading}")
    userhistories_df = fetch_data_from_mongodb(userhistories_collection_name)
    blogs_df = fetch_data_from_mongodb(collection)

    user_to_recommend = 'jap'

    colaborative_recommendations = recommend_articles(userhistories_df, blogs_df, user_to_recommend)
    print(f"these are colab reco {colaborative_recommendations}")
    try:
        # print("Entered the try loop")
        ans = recommend(clickedPostHeading, df)
        # print("Cleared the recommend execution")
        response = jsonify({'data': ans,'colaborative_recommendations': colaborative_recommendations})
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


def get_recommendation(df):
    cv = CountVectorizer(max_features=5000, stop_words='english')
    # print(f'this is df inside get_recommendation: {df}')
    vectors = cv.fit_transform(df['Category']).toarray()
    similarity = cosine_similarity(vectors)
    return similarity

def recommend(blog, df):

    blog_index = df[df['Heading'] == blog].index[0]
    distances = get_recommendation(df)[blog_index]
    blog_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[0:]
    final_recco = [df.iloc[i[0]].Heading for i in blog_list]
    return final_recco
    # except IndexError:
    #     print(f"Error: No matching rows for blog heading '{blog}'")
    #     return []
def recommend_articles(userhistories_df, blogs_df, user_to_recommend, N=2):
    # ... (your existing function code)
       # Load userhistories JSON
    df = userhistories_df
    df1 = blogs_df
    print(f"this is blogs data {df1.head()}")
    print(f"this is usersview data {df.head()}")
    # Extract unique userId and corresponding viewedBlogs
    unique_users = df.groupby('userId')['viewedBlogs'].apply(lambda x: [blog['heading'] for blogs in x for blog in blogs]).reset_index()

    # Create a new DataFrame with unique userId and corresponding headings
    new_df = pd.DataFrame({'userId': unique_users['userId'], 'Headings': unique_users['viewedBlogs']})

    # Explode the 'Headings' column to separate rows
    exploded_df = new_df.explode('Headings')

    # Get unique headings
    unique_headings = exploded_df['Headings'].unique()

    # Create a DataFrame with unique headings
    unique_headings_df = pd.DataFrame({'UniqueHeadings': unique_headings})

    # Load blogs JSON
    blog_data = blogs_df

    # Add a new column 'new_heading' to match with the existing headings
    new_df['new_heading'] = blog_data['Heading']

    # Create an empty DataFrame for users with columns from headings
    user_columns_df = pd.DataFrame(columns=unique_headings_df['UniqueHeadings'])

    # Merge the user DataFrame with the DataFrame containing columns from headings
    result_df = pd.concat([new_df.set_index('userId'), user_columns_df], axis=1, sort=False)

    # Fill NaN values with 0 if needed
    result_df = result_df.fillna(0)

    result_df.drop(columns=['new_heading'], inplace=True)
    # Mark 1 for articles read by users
    for i, row in result_df.iterrows():
        for col in result_df.columns:
            if col in row['Headings']:
                result_df.loc[i, col] = 1

    result_df.drop(columns=['Headings'], inplace=True)
    result_df.index = result_df.index.astype(str)
    # Extract only numeric columns for cosine similarity calculation
    numeric_columns = result_df.select_dtypes(include=[np.number]).columns
    result_df_numeric = result_df[numeric_columns]

    # Drop the first column (assuming it contains strings)
    result_df_numeric = result_df_numeric.iloc[:, 1:]

    # Calculate cosine similarity
    result_df_numeric.index = result_df_numeric.index.astype(str)
    result_df_reset = result_df_numeric.reset_index(drop=True)
    # print(result_df_reset.values)
    similarities = cosine_similarity(result_df_reset.values)
    similarity_df = pd.DataFrame(similarities, index=result_df_numeric.index, columns=result_df_numeric.index)
    # print(similarity_df)
    def get_top_similar_users(user,similarity_df,N=2):
      user_similarities = similarity_df.loc[user]
      user_similarities = user_similarities.drop(user)

      user_similarities = user_similarities.sort_values(ascending=False)

      return user_similarities.head(N)
    # Get top similar users
    top_similar_users = get_top_similar_users(user_to_recommend, similarity_df, N=N)

    # Extract the articles read by the similar users
    articles_read_by_similar_users = result_df.loc[top_similar_users.index]
    articles_read_by_user = result_df.loc[user_to_recommend]

    # Identify articles not read by the new user
    articles_not_read = articles_read_by_similar_users[
        (articles_read_by_similar_users == 1) & (articles_read_by_user.isna() | (articles_read_by_user == 0))
    ]

    # Extract the article headings where the cell is marked as 1 in any row
    recommended_articles = articles_not_read.columns[articles_not_read.eq(1).any(axis=0)].tolist()

    return recommended_articles
    

@app.route('/similar_user_recommend',methods=['GET', 'OPTIONS'])
@cross_origin()
def similar_user_recommendations():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
    else:
        userhistories_df = fetch_data_from_mongodb(userhistories_collection_name)
        blogs_df = fetch_data_from_mongodb(collection)

        user_to_recommend = 'jap'

        colaborative_recommendations = recommend_articles(userhistories_df, blogs_df, user_to_recommend)
        print(f"these are colab reco {colaborative_recommendations}")

        response = jsonify({'recommendations': colaborative_recommendations})

    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response
# test_text_for_summary = 'this is textp'
# summary = summarization_pipeline(test_text_for_summary, max_length=150, min_length=50, length_penalty=2.0, num_beams=4)[0]['summary_text']
# @app.route('/summarize', methods=['POST'])
# def summarize_text():
#     try:
#         data = request.get_json()
#         text = data['text']

#         # Summarize the input text
#         summary = summarization_pipeline(text, max_length=150, min_length=50, length_penalty=2.0, num_beams=4)[0]['summary_text']

#         return jsonify({'summary': summary})

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
