import os
import hashlib

def generate_sha256_hash(data):
    return hashlib.sha256(data.encode()).hexdigest()

# Generate random strings for the secrets
SECRET1 = os.urandom(32).hex()
SECRET2 = os.urandom(32).hex()

# Calculate SHA256 hashes for the secrets
SHA256_SECRET1 = generate_sha256_hash(SECRET1)
SHA256_SECRET2 = generate_sha256_hash(SECRET2)

# Output the generated secrets in .env format
with open('/build/packages/server/.env', 'a') as env_file:
    env_file.write(f"JWT_SECRET={SHA256_SECRET1}\n")
    env_file.write(f"COOKIE_SECRET={SHA256_SECRET2}\n")
