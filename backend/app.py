from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import cv2
import base64

app = Flask(__name__)
# Allow all connections (Solves the CORS error)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- DATABASES ---
known_faces_db = {}  # Stores faces: { "email": encoding }
vote_counts = {      # Stores votes
    "Team Iron Man": 0,
    "Team Captain America": 0,
    "Team Thor": 0
}
voted_users = []     # Prevents double voting: ["email1", "email2"]

def decode_image(base64_string):
    if "base64," in base64_string:
        base64_string = base64_string.split(",")[1]
    image_bytes = base64.b64decode(base64_string)
    nparr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

@app.route('/')
def home():
    return jsonify(vote_counts) # Show current votes on home page

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    image_data = data.get('image')

    if not email or not image_data:
        return jsonify({"success": False, "message": "Missing data"}), 400

    try:
        img = decode_image(image_data)
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_img)
        if len(face_locations) == 0:
            return jsonify({"success": False, "message": "No face detected!"}), 400
        
        face_encoding = face_recognition.face_encodings(rgb_img, face_locations)[0]
        known_faces_db[email] = face_encoding.tolist()
        return jsonify({"success": True})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Server Error"}), 500

@app.route('/verify-face', methods=['POST'])
def verify_face():
    data = request.json
    image_data = data.get('image')

    if not image_data:
        return jsonify({"verified": False}), 400

    try:
        img = decode_image(image_data)
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_img)
        if len(face_locations) == 0:
            return jsonify({"verified": False, "message": "No face detected"}), 400

        unknown_encoding = face_recognition.face_encodings(rgb_img, face_locations)[0]

        if not known_faces_db:
             return jsonify({"verified": False, "message": "Database empty"}), 200

        known_encodings_list = [np.array(enc) for enc in known_faces_db.values()]
        emails = list(known_faces_db.keys())

        matches = face_recognition.compare_faces(known_encodings_list, unknown_encoding, tolerance=0.5)

        if True in matches:
            first_match_index = matches.index(True)
            email = emails[first_match_index]
            
            # CHECK IF ALREADY VOTED
            if email in voted_users:
                return jsonify({"verified": False, "message": "ALREADY VOTED!"})

            return jsonify({"verified": True, "email": email})
        else:
            return jsonify({"verified": False, "message": "Face not recognized"})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"verified": False}), 500

@app.route('/cast-vote', methods=['POST'])
def cast_vote():
    data = request.json
    candidate = data.get('candidate')
    email = data.get('email') # In a real app, we'd pass this securely

    if candidate in vote_counts:
        vote_counts[candidate] += 1
        if email: 
            voted_users.append(email)
        return jsonify({"success": True, "counts": vote_counts})
    
    return jsonify({"success": False, "message": "Invalid Candidate"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)