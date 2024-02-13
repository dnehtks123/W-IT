import serial
import mysql.connector

# MySQL 연결 설정
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'water',
    'auth_plugin': 'mysql_native_password'
}

# MySQL 연결 생성
conn = mysql.connector.connect(**db_config)

# 시리얼 포트 설정
port = 'COM4'
baudrate = 9600

# 시리얼 포트 열기
ser = serial.Serial(port, baudrate)

# 센서 데이터를 저장할 변수 초기화
turbidity = None
humidity = None
pH = None
temperature = None

while True:
    # 시리얼 데이터 수신
    line = ser.readline().decode('latin-1').strip()

    # 데이터 처리
    try:
        if line.startswith('NTU:'):
            turbidity_str = line.split(':')[1].strip()
            turbidity = float(turbidity_str)
        elif line.startswith('humidity:'):
            humidity_str = line.split(':')[1].strip()
            humidity = float(humidity_str)
        elif line.startswith('pH:'):
            pH_str = line.split(':')[1].strip()
            pH = float(pH_str)
        else:
            temperature_str = line.split()[0]
            temperature = float(temperature_str)

        # 모든 센서의 값이 수신되었을 때 MySQL에 삽입
        if turbidity is not None and humidity is not None and pH is not None and temperature is not None:
            cursor = conn.cursor()
            query = "INSERT INTO quality (temperature, humidity, pH,  turbidity) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (temperature, humidity, pH,  turbidity))
            conn.commit()
            cursor.close()
            print("데이터 삽입 완료:", temperature, humidity, pH,  turbidity)

            # 변수 초기화
            turbidity = None
            humidity = None
            pH = None
            temperature = None

    except (ValueError, IndexError):
        print("잘못된 데이터:", line)
