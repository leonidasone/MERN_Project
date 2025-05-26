@echo off
echo Finding process using port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /f /pid %%a
)
echo Port 5000 should now be free!
pause
