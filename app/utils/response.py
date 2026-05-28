from datetime import datetime

def success_response(message="Success", data=None, status_code=200):
    return {
        "success": True,
        "status_code": status_code,
        "message": message,
        "data": data,
        "error": None,
        "timestamp": datetime.now().isoformat()
    }

def error_response(message="Error", status_code=500, error=None):
    return {
        "success": False,
        "status_code": status_code,
        "message": message,
        "data": None,
        "error": str(error) if error else None,
        "timestamp": datetime.now().isoformat()
    }