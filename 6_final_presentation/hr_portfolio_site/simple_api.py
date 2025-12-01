#!/usr/bin/env python3
"""
Simple API Server for HR Analytics
Saves survey data to JSON files and provides endpoints for dashboard
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from collections import defaultdict

# Load configuration
try:
    from config import FLASK_DEBUG, PORT, CORS_ORIGINS
except ImportError:
    # Fallback if config.py not available
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    PORT = int(os.getenv('PORT', '5001'))
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

app = Flask(__name__)

# Configure CORS for production
CORS(app, origins=CORS_ORIGINS)

# Data files
QUESTIONNAIRE_FILE = 'data/questionnaires.json'
APPRAISAL_FILE = 'data/appraisals.json'

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

def load_json(filepath, default=None):
    """Load JSON file or return default"""
    if default is None:
        default = []
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except:
            return default
    return default

def save_json(filepath, data):
    """Save data to JSON file"""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/questionnaire', methods=['POST'])
def save_questionnaire():
    """Save employee questionnaire response"""
    try:
        data = request.get_json()
        
        # Add metadata
        data['saved_at'] = datetime.now().isoformat()
        data['id'] = f"Q-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Load existing data
        questionnaires = load_json(QUESTIONNAIRE_FILE, [])
        questionnaires.append(data)
        
        # Save
        save_json(QUESTIONNAIRE_FILE, questionnaires)
        
        return jsonify({
            'success': True, 
            'message': 'Questionnaire saved successfully',
            'id': data['id']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/appraisal', methods=['POST'])
def save_appraisal():
    """Save manager appraisal"""
    try:
        data = request.get_json()
        
        # Add metadata
        data['saved_at'] = datetime.now().isoformat()
        data['id'] = f"A-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Load existing data
        appraisals = load_json(APPRAISAL_FILE, [])
        appraisals.append(data)
        
        # Save
        save_json(APPRAISAL_FILE, appraisals)
        
        return jsonify({
            'success': True, 
            'message': 'Appraisal saved successfully',
            'id': data['id']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/satisfaction-stats', methods=['GET'])
def get_satisfaction_stats():
    """Calculate satisfaction statistics from questionnaires"""
    try:
        questionnaires = load_json(QUESTIONNAIRE_FILE, [])
        
        if not questionnaires:
            return jsonify({
                'success': True,
                'data': {
                    'total_responses': 0,
                    'avg_environment': 0,
                    'avg_job': 0,
                    'avg_relationship': 0,
                    'avg_work_life_balance': 0,
                    'avg_overall': 0
                }
            })
        
        # Calculate averages
        total = len(questionnaires)
        env_sum = sum(int(q.get('environmentSatisfaction', 0)) for q in questionnaires)
        job_sum = sum(int(q.get('jobSatisfaction', 0)) for q in questionnaires)
        rel_sum = sum(int(q.get('relationshipSatisfaction', 0)) for q in questionnaires)
        wlb_sum = sum(int(q.get('workLifeBalance', 0)) for q in questionnaires)
        
        env_avg = round(env_sum / total, 2) if total > 0 else 0
        job_avg = round(job_sum / total, 2) if total > 0 else 0
        rel_avg = round(rel_sum / total, 2) if total > 0 else 0
        wlb_avg = round(wlb_sum / total, 2) if total > 0 else 0
        overall_avg = round((env_avg + job_avg + rel_avg + wlb_avg) / 4, 2)
        
        return jsonify({
            'success': True,
            'data': {
                'total_responses': total,
                'avg_environment': env_avg,
                'avg_job': job_avg,
                'avg_relationship': rel_avg,
                'avg_work_life_balance': wlb_avg,
                'avg_overall': overall_avg
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/performance-stats', methods=['GET'])
def get_performance_stats():
    """Calculate performance statistics from appraisals"""
    try:
        appraisals = load_json(APPRAISAL_FILE, [])
        
        if not appraisals:
            return jsonify({
                'success': True,
                'data': {
                    'total_appraisals': 0,
                    'avg_performance': 0,
                    'avg_leadership': 0,
                    'avg_communication': 0,
                    'avg_innovation': 0
                }
            })
        
        total = len(appraisals)
        perf_sum = sum(int(a.get('performanceRating', 0)) for a in appraisals)
        lead_sum = sum(int(a.get('leadershipSkills', 0)) for a in appraisals)
        comm_sum = sum(int(a.get('communication', 0)) for a in appraisals)
        inno_sum = sum(int(a.get('innovation', 0)) for a in appraisals)
        
        return jsonify({
            'success': True,
            'data': {
                'total_appraisals': total,
                'avg_performance': round(perf_sum / total, 2) if total > 0 else 0,
                'avg_leadership': round(lead_sum / total, 2) if total > 0 else 0,
                'avg_communication': round(comm_sum / total, 2) if total > 0 else 0,
                'avg_innovation': round(inno_sum / total, 2) if total > 0 else 0
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/all-data', methods=['GET'])
def get_all_data():
    """Get all questionnaires and appraisals"""
    try:
        questionnaires = load_json(QUESTIONNAIRE_FILE, [])
        appraisals = load_json(APPRAISAL_FILE, [])
        
        return jsonify({
            'success': True,
            'data': {
                'questionnaires': questionnaires,
                'appraisals': appraisals,
                'total_questionnaires': len(questionnaires),
                'total_appraisals': len(appraisals)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 HR Analytics API Server Starting...")
    print("=" * 60)
    print(f"📊 Questionnaires file: {QUESTIONNAIRE_FILE}")
    print(f"⭐ Appraisals file: {APPRAISAL_FILE}")
    print(f"🌐 Server running on: http://localhost:{PORT}")
    print(f"🔒 CORS Origins: {CORS_ORIGINS}")
    print(f"🐛 Debug mode: {FLASK_DEBUG}")
    print("=" * 60)
    print("\nEndpoints:")
    print("  POST /api/questionnaire - Save questionnaire")
    print("  POST /api/appraisal - Save appraisal")
    print("  GET  /api/satisfaction-stats - Get satisfaction statistics")
    print("  GET  /api/performance-stats - Get performance statistics")
    print("  GET  /api/all-data - Get all data")
    print("  GET  /api/health - Health check")
    print("=" * 60)
    print("\nPress Ctrl+C to stop\n")
    
    app.run(host='0.0.0.0', port=PORT, debug=FLASK_DEBUG)
