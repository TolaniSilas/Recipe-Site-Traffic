# Use the official Python 3.12 slim image as the base image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Install uv (via pip for simplicity)
RUN pip install --no-cache-dir uv

# Copy Python project metadata and install dependencies
COPY pyproject.toml ./

# After (tell uv to use system env)
RUN uv pip install . --system --no-cache-dir

# Copy backend code and shared src package into the image
COPY app/api_dev ./app/api_dev
COPY src ./src

# (Optional) if you want models baked in instead of mounted:
# COPY models ./models

# Switch to the API app directory
WORKDIR /app/app/api_dev

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]