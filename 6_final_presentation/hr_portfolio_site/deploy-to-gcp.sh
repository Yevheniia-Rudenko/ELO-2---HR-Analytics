#!/bin/bash

# HR Analytics - Quick Deploy to GCP Cloud Run

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 HR ANALYTICS - GCP CLOUD RUN DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed!"
    echo "📥 Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Configuration
read -p "Enter your GCP Project ID: " PROJECT_ID
read -p "Enter region (default: us-central1): " REGION
REGION=${REGION:-us-central1}
SERVICE_NAME="hr-analytics-api"

echo ""
echo "📋 Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"
echo ""

# Set project
echo "🔧 Setting GCP project..."
gcloud config set project $PROJECT_ID

# Enable APIs
echo "🔌 Enabling required APIs..."
gcloud services enable run.googleapis.com \
    containerregistry.googleapis.com \
    bigquery.googleapis.com

# Build and deploy
echo "🏗️  Building and deploying to Cloud Run..."
cd "$(dirname "$0")"

gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID,PORT=8080"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your API is live at:"
echo "   $SERVICE_URL"
echo ""
echo "🧪 Test it:"
echo "   curl $SERVICE_URL/api/health"
echo ""
echo "📝 Next steps:"
echo "   1. Update js/app.js with API URL:"
echo "      const API_URL = '$SERVICE_URL/api';"
echo ""
echo "   2. Test endpoints:"
echo "      $SERVICE_URL/api/satisfaction-stats"
echo "      $SERVICE_URL/api/performance-stats"
echo "      $SERVICE_URL/api/all-data"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
