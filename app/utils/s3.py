import boto3

# 🔑 apne IAM keys yaha daal (interview me bolna env vars use karte hain)
AWS_ACCESS_KEY = "YOUR_ACCESS_KEY"
AWS_SECRET_KEY = "YOUR_SECRET_KEY"
REGION = "ap-south-1"
BUCKET = "your-bucket-name"

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=REGION
)

def generate_presigned_upload_url(filename: str, content_type: str):
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": BUCKET,
            "Key": filename,
            "ContentType": content_type
        },
        ExpiresIn=300  # 5 min
    )


def get_file_url(filename: str):
    return f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{filename}"