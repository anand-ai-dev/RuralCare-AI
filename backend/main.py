from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai import analyze_patient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Patient(BaseModel):
    name: str
    age: str
    gender: str
    symptoms: str
    duration: str
    history: str
    temperature: str
    pulse: str

@app.get("/")
def home():
    return {"message": "RuralCare AI Backend Running"}



@app.post("/analyze")
def analyze(patient: Patient):
    try:
        result = analyze_patient(patient.dict())
        return {"result": result}
    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}