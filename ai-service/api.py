from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import math
from typing import Dict, Any

app = FastAPI(title="InfraLense AI Service")

class GapRequest(BaseModel):
    population: int
    schools_existing: int
    hospitals_existing: int
    banks_existing: int

class PredictionRequest(BaseModel):
    current_pop: int
    growth_rate: float = 0.02
    years: int = 10

@app.get("/health")
def health_check():
    return {"status": "nominal"}

@app.post("/api/gap-analysis")
def calculate_gap(req: GapRequest) -> Dict[str, Any]:
    # AI Logic implementation as per specifications
    required_schools = (req.population * 0.20) / 500
    required_hospitals = req.population / 10000
    required_banks = req.population / 2000
    
    gaps = {
        "schools":   {"existing": req.schools_existing,   "required": math.ceil(required_schools),   "gap": max(0, math.ceil(required_schools) - req.schools_existing)},
        "hospitals": {"existing": req.hospitals_existing, "required": math.ceil(required_hospitals), "gap": max(0, math.ceil(required_hospitals) - req.hospitals_existing)},
        "banks":     {"existing": req.banks_existing,     "required": math.ceil(required_banks),     "gap": max(0, math.ceil(required_banks) - req.banks_existing)},
    }
    
    severity_score = sum(g["gap"] / g["required"] for g in gaps.values() if g["required"] > 0) / 3
    priority_score = severity_score * math.log1p(req.population)
    
    return {
        "analysis": gaps,
        "severity": min(1.0, severity_score), 
        "priority_score": priority_score,
        "is_critical": severity_score > 0.6
    }

@app.post("/api/predict")
def predict_population(req: PredictionRequest):
    predictions = [
        {"year": f"+{y}", "projected_pop": int(req.current_pop * (1 + req.growth_rate) ** y)} 
        for y in range(1, req.years + 1)
    ]
    return {"projection": predictions}

# To run: uvicorn api:app --reload --port 8000
