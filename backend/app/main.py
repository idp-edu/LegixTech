from fastapi import FastAPI
from app.routers import saved, notifications, daily_summary

app = FastAPI(title="LegixTech API")

app.include_router(saved.router, prefix="/saved", tags=["Salvos"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notificações"])
app.include_router(daily_summary.router, prefix="/daily-summary", tags=["Resumo Diário"])

@app.get("/")
def root():
    return {"status": "LegixTech API rodando"}