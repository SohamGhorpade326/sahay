FROM python:3.11-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1

COPY requirements.txt .
RUN pip install --no-cache-dir --no-compile -r requirements.txt
COPY . .
RUN mkdir -p data

EXPOSE 8005
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8005/health')"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8005"]
