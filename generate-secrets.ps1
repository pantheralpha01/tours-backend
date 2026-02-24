Write-Host " Generating secure JWT secrets...`n" -ForegroundColor Cyan
function Get-RandomString {
    $bytes = New-Object byte[] 64
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}
Write-Host "Add these to your .env.production file:`n" -ForegroundColor Yellow
Write-Host "JWT_SECRET=" -NoNewline
Write-Host (Get-RandomString) -ForegroundColor Green
Write-Host "ACCESS_TOKEN_SECRET=" -NoNewline
Write-Host (Get-RandomString) -ForegroundColor Green
Write-Host "REFRESH_TOKEN_SECRET=" -NoNewline
Write-Host (Get-RandomString) -ForegroundColor Green
Write-Host "`n Secrets generated successfully!" -ForegroundColor Cyan
