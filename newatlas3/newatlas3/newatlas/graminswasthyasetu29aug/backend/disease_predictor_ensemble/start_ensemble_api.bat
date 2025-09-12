@echo off
echo Starting Disease Predictor Ensemble API on Port 5003...
echo =====================================================

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH!
    pause
    exit /b 1
)

echo.
echo Starting API server...
python ensemble_api.py

echo.
echo API server has stopped.
pause
