from fastapi import FastAPI
from pydantic import BaseModel
import math

app = FastAPI()

class GapRequest(BaseModel):
    population: int
    schools: int
    hospitals: int
    banks: int

@app.post("/api/analyze-full")
def analyze_full(req: GapRequest):
    # --- 1. Current Gap Analysis ---
    # WHO/UNESCO standard ratios (simplified)
    # 1 school per 500 children (assuming 20% children)
    # 1 hospital per 10,000 people
    # 1 bank per 2,000 people
    
    req_schools   = (req.population * 0.20) / 500
    req_hospitals = req.population / 10000
    req_banks     = req.population / 2000

    def gap_info(existing, required):
        gap = max(0, required - existing)
        severity = gap / required if required > 0 else 0
        return { 
            "existing": existing, 
            "required": round(required), 
            "gap": round(gap), 
            "severity": round(float(severity), 2) 
        }

    schools_data   = gap_info(req.schools,   req_schools)
    hospitals_data = gap_info(req.hospitals, req_hospitals)
    banks_data     = gap_info(req.banks,     req_banks)

    avg_severity = (schools_data["severity"] + hospitals_data["severity"] + banks_data["severity"]) / 3
    priority = avg_severity * math.log1p(req.population)

    # --- 2. 5-Year Prediction ---
    years = 5
    growth_rate = 0.025
    future_pop = req.population * ((1 + growth_rate) ** years)
    
    future_req_schools   = (future_pop * 0.20) / 500
    future_req_hospitals = future_pop / 10000
    future_req_banks     = future_pop / 2000

    prediction = {
        "projection_years": years,
        "future_population": round(future_pop),
        "gaps": {
            "schools":   {"existing": req.schools,   "future_required": round(future_req_schools),   "future_gap": round(max(0, future_req_schools - req.schools))},
            "hospitals": {"existing": req.hospitals, "future_required": round(future_req_hospitals), "future_gap": round(max(0, future_req_hospitals - req.hospitals))},
            "banks":     {"existing": req.banks,     "future_required": round(future_req_banks),     "future_gap": round(max(0, future_req_banks - req.banks))}
        }
    }

    return {
        "gaps": { "schools": schools_data, "hospitals": hospitals_data, "banks": banks_data },
        "severity": round(float(avg_severity), 2),
        "priority": round(float(priority), 2),
        "label": "critical" if avg_severity > 0.6 else "moderate" if avg_severity > 0.3 else "low",
        "prediction": prediction
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
