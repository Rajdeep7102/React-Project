from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        user_representation = request.json['user_representation']
        blogs_representation = request.json['blogs_representation']

        # TF-IDF Vectorization
        tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf_vectorizer.fit_transform([user_representation] + blogs_representation)

        # Compute cosine similarity
        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

        # Get relevant blog recommendations
        user_tfidf = tfidf_vectorizer.transform([user_representation])
        cosine_similarities = linear_kernel(user_tfidf, tfidf_matrix).flatten()
        related_blogs_indices = cosine_similarities.argsort()[:-3:-1]  # Get top 2 recommendations

        recommendations = [blogs[idx] for idx in related_blogs_indices]
        return jsonify(recommendations)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)