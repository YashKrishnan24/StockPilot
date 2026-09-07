import urllib.request
import json
import urllib.error

url = "http://localhost:8000/api/auth/register?business_name=TestBusiness"
data = {
    "name": "Yash Krishnan",
    "email": "yashkrishnan07@gmail.com",
    "password": "password123"
}
data_encoded = json.dumps(data).encode('utf-8')
req = urllib.request.Request(url, data=data_encoded, headers={'Content-Type': 'application/json'})

try:
    response = urllib.request.urlopen(req)
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(e)
