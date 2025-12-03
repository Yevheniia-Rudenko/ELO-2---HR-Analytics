"""
Load environment variables from .env file
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Export configuration
GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID', 'your-test-project-id')
GCP_DATASET = os.getenv('GCP_DATASET', 'TestDataset')
GCP_TABLE = os.getenv('GCP_TABLE', 'test_table')
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
PORT = int(os.getenv('PORT', '5001'))
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

# BigQuery table full path
BIGQUERY_TABLE = f'{GCP_PROJECT_ID}.{GCP_DATASET}.{GCP_TABLE}'
