from fastapi import FastAPI
from .schemas import PredictionInput
from fastapi import HTTPException


app = FastAPI(__name__)
