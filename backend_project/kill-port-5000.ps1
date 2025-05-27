Write-Host "Finding and killing process using port 5000..." -ForegroundColor Yellow

# Find the process using port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -First 1

if ($process) {
    $pid = $process.OwningProcess
    Write-Host "Found process with PID: $pid" -ForegroundColor Green
    
    try {
        Stop-Process -Id $pid -Force
        Write-Host "Successfully killed process $pid" -ForegroundColor Green
        Write-Host "Port 5000 is now free!" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to kill process: $($_.Exception.Message)" -ForegroundColor Red
    }
}
else {
    Write-Host "No process found using port 5000" -ForegroundColor Yellow
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
