import sys
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

def generate_secrets(filename):
    try:
        with open(filename, 'a') as file:
            file.write(f"JWT_SECRET={SHA256_SECRET1}\n")
            file.write(f"COOKIE_SECRET={SHA256_SECRET2}\n")
    except IOError as e:
            print(f'Error writing to {filename}: {e}')

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <filename>")
        sys.exit(1)
    filename = sys.argv[1]
    generate_secrets(filename)
