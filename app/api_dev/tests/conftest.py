"""
shared pytest configuration for api tests.
ensures the project root is on sys.path and exposes a fastapi TestClient.
"""

import sys
from pathlib import Path


# compute project root: .../Recipe-Site-Traffic
project_root = Path(__file__).resolve().parents[3]
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))


import pytest
from fastapi.testclient import TestClient
from app.api_dev.main import app  # noqa: E402


# expose a TestClient fixture for testing the fastapi app.
@pytest.fixture(scope="session")
def client() -> TestClient:
    """FastAPI TestClient for the Tasty Bytes API."""
    
    return TestClient(app)

