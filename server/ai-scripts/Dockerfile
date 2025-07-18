FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y ffmpeg libgl1 libglib2.0-0 && \
    apt-get clean

COPY server/ai-scripts/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ai-scripts/ .

CMD ["python", "ai_strict_video_analysis.py"] 
