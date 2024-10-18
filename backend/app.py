from flask import Flask, jsonify, request, redirect, session
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

app = Flask(__name__)
app.secret_key = os.urandom(16)

# MongoDB connection
client = MongoClient('mongodb://mongo:27017/')
db = client.mydb
CORS(app, supports_credentials=True)

# spotify API connection
SPOTIPY_CLIENT_ID = os.environ.get('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = 'http://localhost:5000/callback'


# Spotify OAuth object
sp_oauth = SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope="user-top-read"
)

@app.route('/')
def index():
    return jsonify({'message': 'database home'})

@app.route('/login', methods=['POST'])
def login_user():
    login = request.json
    userDB = db.users.find_one({'username': login['username'], 'password': login['password']})
    if userDB:
        return jsonify({'message': 'login successful'})
    else:
        return jsonify({'message': 'login failed'})
    
    
@app.route('/users', methods=['GET'])
def get_users():
    userDB = db.users.find()
    users = []
    for user in userDB:
        users.append({
            'username': user['username'],
            'password': user['password'],
            'name': user['name'],
            'email': user['email']
        })
    return jsonify(users)

@app.route('/register', methods=['POST'])
def register_user():
    userdata = request.json
    # check if user already exists
    indb = db.users.find_one({'username': userdata['username'], 'email': userdata['email']})
    if indb:
        return jsonify({'message': 'user already exists'})
    
    # check if all fields are present
    elif 'username' in userdata and 'password' in userdata and 'name' in userdata and 'email' in userdata:
        # add user
        user_id = db.users.insert_one({
            'username': userdata['username'],
            'password': userdata['password'],
            'name': userdata['name'],
            'email': userdata['email']
        }).inserted_id
        return jsonify({"message": "User added","id": str(user_id) ,"username": str(userdata['username']), "password": str(userdata['password']), "name": str(userdata['name']), "email": str(userdata['email'])}), 201
    else:
        return jsonify({"error": "Invalid data"}), 400

# this is kinda dumb but dont go to this URL unless you want to clear the user database
# should eventually make this better but for now this is fine
@app.route('/clear_users', methods=['GET','DELETE'])
def clear_users():
    db.users.delete_many({})
    return jsonify({"message": "Users deleted"}), 200

@app.route('/spotify_login')
def spotify_login():
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/callback', methods=['GET'])
def spotify_callback():
    session.clear()
    token_info = sp_oauth.get_access_token(request.args.get('code'))
    session['token_info'] = token_info
    return redirect(f'http://localhost:4000/spotify-tracks?access_token={token_info["access_token"]}')

@app.route('/get_token', methods=['GET'])
def get_token():
    token_info = session.get('token_info', {})
    if 'access_token' in token_info:
        return jsonify({'access_token': token_info['access_token']}), 200
    return jsonify({'error': 'No access token found'}), 404


@app.route('/add_tracks', methods=['POST'])
def add_track():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401  # Unauthorized

    access_token = auth_header.split(' ')[1]  # Extract access token

    sp = Spotify(auth=access_token)

    try:
        tracks = sp.current_user_top_tracks(limit=50, time_range='long_term')  # Fetch top 10 tracks
        track_info = []
        for track in tracks['items']:
            track_info.append({
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'album': track['album']['name'],
                'image': track['album']['images'][0]['url']
            })
        db.tracks.insert_many(track_info)
        return jsonify(tracks), 201  # Created
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Internal server error


@app.route('/tracks', methods=['GET'])
def get_tracks():
    tracks = db.tracks.find()
    return jsonify([{**track, '_id': str(track['_id'])} for track in tracks])

@app.route('/clear_tracks', methods=['DELETE', 'GET'])
def clear_tracks():
    db.tracks.delete_many({})
    return jsonify({"message": "Tracks cleared"}), 200

@app.route('/session-clear')
def clear_session():
    session.clear()
    return jsonify({"message": "Session cleared"}), 200




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
