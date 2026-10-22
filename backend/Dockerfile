FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock README.md ./
COPY . .

RUN uv sync --frozen


EXPOSE 8000

CMD ["uv", "run", "fastapi", "dev", "/app/src/backend/main.py", "--host", "0.0.0.0"]