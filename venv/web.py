from flask import Flask, render_template, jsonify
import mysql.connector
from datetime import datetime
import pandas as pd

app = Flask(__name__)


@app.route('/')

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/join.html')
def join():
    return render_template('join.html')
    
@app.route('/login.html')
def login():
    return render_template('login.html')

@app.route('/index_database.html')
def index_database():
    return render_template('index_database.html')    

@app.route('/prediction.html')
def prediction():
    return render_template('prediction.html')  

# MySQL 연결 설정
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'water',
    'auth_plugin': 'mysql_native_password'
}

def fetch_data(query):
    # MySQL 연결 생성
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # 쿼리 실행
    cursor.execute(query)
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data

# 센서 종류에 따른 API 엔드포인트 함수
def get_sensor_data(sensor_name):
    # 데이터베이스에서 해당 센서 데이터 가져오기 (NULL 값 제외)
    query = f"SELECT {sensor_name} FROM quality WHERE {sensor_name} IS NOT NULL"
    sensor_data = fetch_data(query)

    # 그래프 데이터 형식으로 가공
    labels = [str(i) for i in range(1, len(sensor_data) + 1)]
    sensorData = [item[0] for item in sensor_data]

    # JSON 형식으로 데이터 반환
    return jsonify(labels=labels, data=sensorData)

# API 엔드포인트 라우팅
@app.route('/temperature_data')
def get_temperature_data():
    return get_sensor_data('temperature')

@app.route('/turbidity_data')
def get_turbidity_data():
    return get_sensor_data('turbidity')

@app.route('/ph_data')
def get_ph_data():
    return get_sensor_data('ph')

@app.route('/humidity_data')
def get_humidity_data():
    return get_sensor_data('humidity')

@app.route('/timestamped_data')
def get_timestamped_data():
    query = "SELECT timestamp, temperature, humidity, turbidity, ph FROM quality WHERE timestamp IS NOT NULL"
    timestamped_data = fetch_data(query)

    # 그래프 데이터 형식으로 가공
    labels = [datetime.strptime(item[0], "%Y-%m-%d %H:%M:%S").isoformat() for item in timestamped_data]
    temperature_data = [item[1] for item in timestamped_data]
    humidity_data = [item[2] for item in timestamped_data]
    turbidity_data = [item[3] for item in timestamped_data]
    ph_data = [item[4] for item in timestamped_data]

    # JSON 형식으로 데이터 반환
    return jsonify(labels=labels, temperature=temperature_data, humidity=humidity_data, turbidity=turbidity_data, ph=ph_data)


if __name__ == '__main__':
    app.run(debug=True)
