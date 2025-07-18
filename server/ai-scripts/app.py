from flask import Flask, request, jsonify
from ai_strict_video_analysis import analyze
import traceback

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500 MB, adjust as needed

@app.route('/analyze', methods=['POST'])
def analyze_route():
    data = request.json
    video_path = data.get('video_path')
    scenario = data.get('scenario')
    duration = data.get('duration')
    if not all([video_path, scenario, duration]):
        return jsonify({"error": "Missing required parameters: video_path, scenario, duration"}), 400
    try:
        result = analyze(video_path, scenario, duration)
        return jsonify(result)
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000) 
