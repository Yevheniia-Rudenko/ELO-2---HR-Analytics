#!/bin/bash

# Test HR Analytics API with BigQuery locally

echo "🧪 Testing HR Analytics API with BigQuery"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env with GCP credentials"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if service account key exists
if [ ! -f "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    echo "❌ Error: Service account key not found at $GOOGLE_APPLICATION_CREDENTIALS"
    exit 1
fi

echo "✅ Environment configured"
echo "📊 Project: $GCP_PROJECT_ID"
echo "🗄️ Dataset: $GCP_DATASET"
echo ""

# Kill any existing Flask process on port 8080
echo "🔄 Stopping any existing server on port 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Start the server
echo "🚀 Starting API server with BigQuery..."
python3 app_bigquery.py
