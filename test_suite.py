import urllib.request, urllib.parse, json, traceback

BASE_URL = 'http://localhost:8000/api'
TOKEN = None

def request(method, path, data=None):
    url = f"{BASE_URL}{path}"
    headers = {'Content-Type': 'application/json'}
    if TOKEN:
        headers['Authorization'] = f'Bearer {TOKEN}'
    
    encoded_data = json.dumps(data).encode('utf-8') if data else b''
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read()) if resp.length else None
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        raise Exception(f"HTTP {e.code}: {body}")

try:
    print("1. Logging in...")
    data = urllib.parse.urlencode({'username':'test2@example.com','password':'password123'}).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/auth/login", data=data)
    resp = urllib.request.urlopen(req)
    TOKEN = json.loads(resp.read())['access_token']
    print("-> Login successful")

    print("\n2. Fetching dashboard stats...")
    stats = request('GET', '/analytics/dashboard')
    print("-> Stats:", stats)

    print("\n3. Creating product...")
    prod = request('POST', '/products/', {
        'name': 'Test Item', 'sku': 'TI-001', 'min_stock_level': 5, 
        'current_stock': 0, 'unit_price': 100, 'cost_price': 50
    })
    print("-> Product created:", prod['id'])
    
    print("\n4. Editing product...")
    updated_prod = request('PUT', f"/products/{prod['id']}", {
        'name': 'Test Item Updated', 'min_stock_level': 10
    })
    print("-> Product updated:", updated_prod['name'], updated_prod['min_stock_level'])

    print("\n5. Deleting product (no history)...")
    delete_res = request('DELETE', f"/products/{prod['id']}")
    print("-> Product deleted:", delete_res)

    print("\n6. Creating product for transaction testing...")
    prod2 = request('POST', '/products/', {
        'name': 'Tx Item', 'sku': 'TX-001', 'min_stock_level': 10, 
        'current_stock': 0, 'unit_price': 200, 'cost_price': 100
    })
    prod2_id = prod2['id']
    print("-> Product created:", prod2_id)

    print("\n7. Creating purchase order...")
    po = request('POST', '/purchase-orders/', {
        'supplier_id': 'supp_123', 'expected_date': '2026-10-10T00:00:00Z',
        'items': [{'product_id': prod2_id, 'quantity': 50, 'cost_price': 100}]
    })
    po_id = po['id']
    print("-> PO created:", po_id)

    print("\n8. Receiving purchase order...")
    po_rcv = request('POST', f"/purchase-orders/{po_id}/receive")
    print("-> PO received, status:", po_rcv['status'])

    print("\n9. Creating sales order...")
    so = request('POST', '/orders/', {
        'customer_name': 'Test Customer',
        'items': [{'product_id': prod2_id, 'quantity': 5, 'unit_price': 200}]
    })
    so_id = so['id']
    print("-> Sales order created:", so_id)

    print("\n10. Fulfilling sales order...")
    so_ful = request('POST', f"/orders/{so_id}/fulfill")
    print("-> SO fulfilled, status:", so_ful['status'])

    print("\n11. Attempting to soft-delete product with history...")
    soft_del = request('DELETE', f"/products/{prod2_id}")
    print("-> Soft delete result:", soft_del)
    
    print("\n12. Fetching dashboard stats again...")
    stats_new = request('GET', '/analytics/dashboard')
    print("-> New Stats:", stats_new)

    print("\nALL TESTS PASSED SUCCESSFULLY!")

except Exception as e:
    print("\nTEST FAILED!")
    print(e)
    traceback.print_exc()
