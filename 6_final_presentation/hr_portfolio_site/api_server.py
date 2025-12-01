#!/usr/bin/env python3
"""
Simple Python API server to fetch data from BigQuery
This acts as a proxy to avoid CORS and authentication issues in the browser
"""

from google.cloud import bigquery
from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize BigQuery client
# Replace 'YOUR_GCP_PROJECT_ID' with your actual GCP project ID
client = bigquery.Client(project='YOUR_GCP_PROJECT_ID')

@app.route('/api/attrition-stats')
def get_attrition_stats():
    """Get overall attrition statistics"""
    query = """
        SELECT
            Attrition,
            COUNT(*) as total,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
        GROUP BY Attrition
        ORDER BY Attrition
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        data = []
        for row in results:
            data.append({
                'attrition': row.Attrition,
                'total': row.total,
                'percentage': float(row.percentage)
            })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/department-attrition')
def get_department_attrition():
    """Get department-wise attrition"""
    query = """
        SELECT
            Department,
            COUNT(*) as attrition_count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
        WHERE Attrition = "Yes"
        GROUP BY Department
        ORDER BY attrition_count DESC
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        data = []
        for row in results:
            data.append({
                'department': row.Department,
                'count': row.attrition_count,
                'percentage': float(row.percentage)
            })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/age-attrition')
def get_age_attrition():
    """Get age group attrition"""
    query = """
        SELECT
            CASE
                WHEN Age BETWEEN 18 AND 25 THEN '18-25'
                WHEN Age BETWEEN 26 AND 35 THEN '26-35'
                WHEN Age BETWEEN 36 AND 45 THEN '36-45'
                WHEN Age BETWEEN 46 AND 55 THEN '46-55'
                ELSE '55+'
            END as age_group,
            COUNT(CASE WHEN Attrition = 'Yes' THEN 1 END) as left_count,
            COUNT(*) as total_count,
            ROUND(COUNT(CASE WHEN Attrition = 'Yes' THEN 1 END) * 100.0 / COUNT(*), 2) as attrition_rate
        FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
        GROUP BY age_group
        ORDER BY 
            CASE age_group
                WHEN '18-25' THEN 1
                WHEN '26-35' THEN 2
                WHEN '36-45' THEN 3
                WHEN '46-55' THEN 4
                ELSE 5
            END
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        data = []
        for row in results:
            data.append({
                'age_group': row.age_group,
                'left_count': row.left_count,
                'total_count': row.total_count,
                'attrition_rate': float(row.attrition_rate)
            })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/overtime-impact')
def get_overtime_impact():
    """Get overtime impact on attrition"""
    query = """
        SELECT
            OverTime,
            Attrition,
            COUNT(*) as count
        FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
        GROUP BY OverTime, Attrition
        ORDER BY OverTime, Attrition
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        data = []
        for row in results:
            data.append({
                'overtime': row.OverTime,
                'attrition': row.Attrition,
                'count': row.count
            })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/work-life-balance')
def get_work_life_balance():
    """Get work-life balance distribution"""
    query = """
        SELECT
            WorkLifeBalance,
            COUNT(*) as count
        FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
        GROUP BY WorkLifeBalance
        ORDER BY WorkLifeBalance
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        data = []
        for row in results:
            data.append({
                'level': row.WorkLifeBalance,
                'count': row.count
            })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/satisfaction-metrics')
def get_satisfaction_metrics():
    """Get average satisfaction metrics"""
    query = """
        SELECT
            ROUND(AVG(JobSatisfaction), 2) as avg_job_satisfaction,
            ROUND(AVG(EnvironmentSatisfaction), 2) as avg_env_satisfaction,
            ROUND(AVG(RelationshipSatisfaction), 2) as avg_rel_satisfaction,
            ROUND(AVG(WorkLifeBalance), 2) as avg_work_life_balance
        FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        for row in results:
            data = {
                'job_satisfaction': float(row.avg_job_satisfaction),
                'environment_satisfaction': float(row.avg_env_satisfaction),
                'relationship_satisfaction': float(row.avg_rel_satisfaction),
                'work_life_balance': float(row.avg_work_life_balance)
            }
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/all-data')
def get_all_data():
    """Get all dashboard data in one request"""
    try:
        # Get all data
        attrition = get_attrition_stats().get_json()
        departments = get_department_attrition().get_json()
        ages = get_age_attrition().get_json()
        overtime = get_overtime_impact().get_json()
        wlb = get_work_life_balance().get_json()
        satisfaction = get_satisfaction_metrics().get_json()
        
        return jsonify({
            'success': True,
            'data': {
                'attrition_stats': attrition.get('data', []),
                'department_attrition': departments.get('data', []),
                'age_attrition': ages.get('data', []),
                'overtime_impact': overtime.get('data', []),
                'work_life_balance': wlb.get('data', []),
                'satisfaction_metrics': satisfaction.get('data', {})
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    # For development
    app.run(host='0.0.0.0', port=5000, debug=True)
