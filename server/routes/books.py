from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
import os

app = Flask(__name__)
CORS(app)

# Determine the directory of the current file (books.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, 'AllBooks.csv')

@app.route('/api/top-books', methods=['GET'])
def get_top_books():
    # df = pd.read_csv('AllBooks.csv')
    df = pd.read_csv(CSV_PATH)
    sorted_df = df.sort_values(by='currentScore', ascending=False)
    top_books = sorted_df.head(10).to_dict(orient='records')
    return jsonify(top_books)

@app.route('/api/all-books', methods=['GET'])
def get_all_books():
    df = pd.read_csv(CSV_PATH)
    all_books = df.to_dict(orient='records')
    return jsonify(all_books)

@app.route('/api/recommend-books', methods=['POST'])
def recommend_books():
    df = pd.read_csv(CSV_PATH)
    author_freq = df['author'].value_counts(normalize=True)
    categories_freq = df['categories'].value_counts(normalize=True)
    df['author_freq_enc'] = df['author'].map(author_freq)
    df['categories_freq_enc'] = df['categories'].map(categories_freq)
    df['currentScore'] = df['currentScore'].fillna(df['currentScore'].mean())
    scaler = MinMaxScaler()
    df['currentScore_scaled'] = scaler.fit_transform(df[['currentScore']])
    X = df[['author_freq_enc', 'categories_freq_enc', 'currentScore_scaled']]
    kmeans = KMeans(n_clusters=20, random_state=42)
    df['cluster'] = kmeans.fit_predict(X)
    
    input_titles = request.json.get('book_titles', [])
    input_df = df[df['book_title'].isin(input_titles)]
    if input_df.empty:
        return jsonify([])
    
    input_clusters = input_df['cluster'].unique()
    recs = df[(df['cluster'].isin(input_clusters)) & (~df['book_title'].isin(input_titles))]
    recs_sorted = recs.sort_values(by='currentScore', ascending=False)
    top_recs = recs_sorted[['book_title', 'author', 'categories', 'currentScore']].head(10).to_dict(orient='records')
    return jsonify(top_recs)

if __name__ == '__main__':
    app.run(port=5001)