import os
from dotenv import load_dotenv
import secrets

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Configuración global
SECRET_KEY = os.getenv("SECRET_KEY") or secrets.token_urlsafe(32)  # Clave secreta para JWT
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # Algoritmo de encriptación para JWT
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))  # Tiempo de expiración del token