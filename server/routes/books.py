from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
import requests
from io import StringIO

app = Flask(__name__)
CORS(app)

FILE_ID = '1_Hb4LcDNw4w9Gp8d2Xmpkw8GqVE00A3O'
CSV_URL = f'https://drive.google.com/uc?export=download&id={FILE_ID}'

def fetch_csv():
    """Fetch CSV data from Google Drive and return as DataFrame"""
    try:
        response = requests.get(CSV_URL)
        response.raise_for_status()
        csv_data = StringIO(response.text)
        return pd.read_csv(csv_data)
    except requests.RequestException as e:
        print(f"Error fetching CSV from Google Drive: {e}")
        return pd.DataFrame()

@app.route('/api/top-books', methods=['GET'])
def get_top_books():
    df = fetch_csv()
    if df.empty:
        return jsonify({"error": "Failed to fetch data"}), 500
    sorted_df = df.sort_values(by='currentScore', ascending=False)
    top_books = sorted_df.head(10).to_dict(orient='records')
    return jsonify(top_books)

@app.route('/api/all-books', methods=['GET'])
def get_all_books():
    df = fetch_csv()
    if df.empty:
        return jsonify({"error": "Failed to fetch data"}), 500
    all_books = df.to_dict(orient='records')
    return jsonify(all_books)

@app.route('/api/recommend-books', methods=['POST'])
def recommend_books():
    df = fetch_csv()
    if df.empty:
        return jsonify({"error": "Failed to fetch data"}), 500
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