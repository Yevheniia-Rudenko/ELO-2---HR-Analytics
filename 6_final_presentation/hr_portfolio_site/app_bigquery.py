#!/usr/bin/env python3
"""
HR Analytics API Server with BigQuery Integration
Handles both reading existing data and saving new survey responses
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import bigquery
from datetime import datetime
import os
import json

# Load configuration
try:
    from config import GCP_PROJECT_ID, GCP_DATASET, GCP_TABLE, CORS_ORIGINS, PORT
except ImportError:
    GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID', 'core-trees-478718-g0')
    GCP_DATASET = os.getenv('GCP_DATASET', 'IBMAnalytics')
    GCP_TABLE = os.getenv('GCP_TABLE', 'employee_attrition')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    PORT = int(os.getenv('PORT', '8080'))

app = Flask(__name__)

# Configure CORS
if CORS_ORIGINS == ['*']:
    CORS(app)
else:
    CORS(app, origins=CORS_ORIGINS)

# Initialize BigQuery client
try:
    client = bigquery.Client(project=GCP_PROJECT_ID)
    print(f"✅ Connected to BigQuery project: {GCP_PROJECT_ID}")
except Exception as e:
    print(f"⚠️ BigQuery initialization warning: {e}")
    print("📝 Will attempt to connect when first query is made")
    client = None

# Table names
SOURCE_TABLE = f'{GCP_PROJECT_ID}.{GCP_DATASET}.{GCP_TABLE}'
QUESTIONNAIRE_TABLE = f'{GCP_PROJECT_ID}.{GCP_DATASET}.questionnaires'
APPRAISAL_TABLE = f'{GCP_PROJECT_ID}.{GCP_DATASET}.appraisals'

def init_bigquery_client():
    """Initialize BigQuery client if not already done"""
    global client
    if client is None:
        client = bigquery.Client(project=GCP_PROJECT_ID)
    return client

def ensure_tables_exist():
    """Create questionnaires and appraisals tables if they don't exist"""
    try:
        bq_client = init_bigquery_client()
        
        # Questionnaires table schema
        questionnaire_schema = [
            bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("employeeId", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("submissionDate", "TIMESTAMP", mode="REQUIRED"),
            bigquery.SchemaField("environmentSatisfaction", "INTEGER", mode="REQUIRED"),
            bigquery.SchemaField("jobSatisfaction", "INTEGER", mode="REQUIRED"),
            bigquery.SchemaField("relationshipSatisfaction", "INTEGER", mode="REQUIRED"),
            bigquery.SchemaField("workLifeBalance", "INTEGER", mode="REQUIRED"),
            bigquery.SchemaField("saved_at", "TIMESTAMP", mode="REQUIRED"),
        ]
        
        # Appraisals table schema
        appraisal_schema = [
            bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("employeeId", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("appraisalDate", "TIMESTAMP", mode="REQUIRED"),
            bigquery.SchemaField("performanceRating", "INTEGER", mode="REQUIRED"),
            bigquery.SchemaField("saved_at", "TIMESTAMP", mode="REQUIRED"),
        ]
        
        # Create questionnaires table
        try:
            table_ref = bigquery.TableReference.from_string(QUESTIONNAIRE_TABLE)
            table = bigquery.Table(table_ref, schema=questionnaire_schema)
            bq_client.create_table(table, exists_ok=True)
            print(f"✅ Questionnaires table ready: {QUESTIONNAIRE_TABLE}")
        except Exception as e:
            print(f"ℹ️ Questionnaires table: {e}")
        
        # Create appraisals table
        try:
            table_ref = bigquery.TableReference.from_string(APPRAISAL_TABLE)
            table = bigquery.Table(table_ref, schema=appraisal_schema)
            bq_client.create_table(table, exists_ok=True)
            print(f"✅ Appraisals table ready: {APPRAISAL_TABLE}")
        except Exception as e:
            print(f"ℹ️ Appraisals table: {e}")
            
    except Exception as e:
        print(f"⚠️ Error ensuring tables exist: {e}")

# Initialize tables on startup
ensure_tables_exist()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'online',
        'project': GCP_PROJECT_ID,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/questionnaire', methods=['POST'])
def save_questionnaire():
    """Save employee questionnaire to BigQuery"""
    try:
        data = request.get_json()
        bq_client = init_bigquery_client()
        
        # Prepare row for BigQuery
        row = {
            'id': f"Q-{datetime.now().strftime('%Y%m%d%H%M%S%f')}",
            'employeeId': data.get('employeeId'),
            'submissionDate': data.get('submissionDate'),
            'environmentSatisfaction': int(data.get('environmentSatisfaction')),
            'jobSatisfaction': int(data.get('jobSatisfaction')),
            'relationshipSatisfaction': int(data.get('relationshipSatisfaction')),
            'workLifeBalance': int(data.get('workLifeBalance')),
            'saved_at': datetime.now().isoformat(),
        }
        
        # Insert into BigQuery
        errors = bq_client.insert_rows_json(QUESTIONNAIRE_TABLE, [row])
        
        if errors:
            return jsonify({'success': False, 'error': str(errors)}), 500
        
        return jsonify({
            'success': True,
            'message': 'Questionnaire saved to BigQuery',
            'id': row['id']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/appraisal', methods=['POST'])
def save_appraisal():
    """Save manager appraisal to BigQuery"""
    try:
        data = request.get_json()
        bq_client = init_bigquery_client()
        
        # Prepare row for BigQuery
        row = {
            'id': f"A-{datetime.now().strftime('%Y%m%d%H%M%S%f')}",
            'employeeId': data.get('employeeId'),
            'appraisalDate': data.get('appraisalDate'),
            'performanceRating': int(data.get('performanceRating')),
            'saved_at': datetime.now().isoformat(),
        }
        
        # Insert into BigQuery
        errors = bq_client.insert_rows_json(APPRAISAL_TABLE, [row])
        
        if errors:
            return jsonify({'success': False, 'error': str(errors)}), 500
        
        return jsonify({
            'success': True,
            'message': 'Appraisal saved to BigQuery',
            'id': row['id']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/satisfaction-stats', methods=['GET'])
def get_satisfaction_stats():
    """Get satisfaction statistics from questionnaires"""
    try:
        bq_client = init_bigquery_client()
        
        query = f"""
        SELECT
            COUNT(*) as total_responses,
            ROUND(AVG(environmentSatisfaction), 2) as avg_environment,
            ROUND(AVG(jobSatisfaction), 2) as avg_job,
            ROUND(AVG(relationshipSatisfaction), 2) as avg_relationship,
            ROUND(AVG(workLifeBalance), 2) as avg_work_life_balance,
            ROUND(AVG((environmentSatisfaction + jobSatisfaction + relationshipSatisfaction + workLifeBalance) / 4), 2) as avg_overall
        FROM `{QUESTIONNAIRE_TABLE}`
        """
        
        query_job = bq_client.query(query)
        results = list(query_job.result())
        
        if results:
            row = results[0]
            stats = {
                'total_responses': row.total_responses,
                'avg_environment': float(row.avg_environment) if row.avg_environment else 0.0,
                'avg_job': float(row.avg_job) if row.avg_job else 0.0,
                'avg_relationship': float(row.avg_relationship) if row.avg_relationship else 0.0,
                'avg_work_life_balance': float(row.avg_work_life_balance) if row.avg_work_life_balance else 0.0,
                'avg_overall': float(row.avg_overall) if row.avg_overall else 0.0,
            }
        else:
            stats = {
                'total_responses': 0,
                'avg_environment': 0.0,
                'avg_job': 0.0,
                'avg_relationship': 0.0,
                'avg_work_life_balance': 0.0,
                'avg_overall': 0.0,
            }
        
        return jsonify({'success': True, 'data': stats})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/performance-stats', methods=['GET'])
def get_performance_stats():
    """Get performance statistics from appraisals"""
    try:
        bq_client = init_bigquery_client()
        
        query = f"""
        SELECT
            COUNT(*) as total_appraisals,
            ROUND(AVG(performanceRating), 2) as avg_performance
        FROM `{APPRAISAL_TABLE}`
        """
        
        query_job = bq_client.query(query)
        results = list(query_job.result())
        
        if results:
            row = results[0]
            stats = {
                'total_appraisals': row.total_appraisals,
                'avg_performance': float(row.avg_performance) if row.avg_performance else 0.0,
            }
        else:
            stats = {
                'total_appraisals': 0,
                'avg_performance': 0.0,
            }
        
        return jsonify({'success': True, 'data': stats})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/all-data', methods=['GET'])
def get_all_data():
    """Get all questionnaires and appraisals"""
    try:
        bq_client = init_bigquery_client()
        
        # Fetch questionnaires
        q_query = f"""
        SELECT *
        FROM `{QUESTIONNAIRE_TABLE}`
        ORDER BY saved_at DESC
        LIMIT 100
        """
        
        # Fetch appraisals
        a_query = f"""
        SELECT *
        FROM `{APPRAISAL_TABLE}`
        ORDER BY saved_at DESC
        LIMIT 100
        """
        
        questionnaires = []
        appraisals = []
        
        try:
            q_job = bq_client.query(q_query)
            for row in q_job.result():
                questionnaires.append(dict(row))
        except Exception as e:
            print(f"Error fetching questionnaires: {e}")
        
        try:
            a_job = bq_client.query(a_query)
            for row in a_job.result():
                appraisals.append(dict(row))
        except Exception as e:
            print(f"Error fetching appraisals: {e}")
        
        return jsonify({
            'success': True,
            'data': {
                'questionnaires': questionnaires,
                'appraisals': appraisals
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print(f"🚀 Starting HR Analytics API Server")
    print(f"📊 Project: {GCP_PROJECT_ID}")
    print(f"🗄️ Dataset: {GCP_DATASET}")
    print(f"🌐 CORS Origins: {CORS_ORIGINS}")
    print(f"🔌 Port: {PORT}")
    
    app.run(
        host='0.0.0.0',
        port=PORT,
        debug=os.getenv('FLASK_DEBUG', 'False') == 'True'
    )
