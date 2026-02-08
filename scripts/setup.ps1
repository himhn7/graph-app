Write-Host "Preparing local environment..."

if (-not (Test-Path ".\backend\.env")) {
  Copy-Item ".\backend\.env.example" ".\backend\.env"
  Write-Host "Created backend\.env from example."
}

if (-not (Test-Path ".\frontend\.env")) {
  Copy-Item ".\frontend\.env.example" ".\frontend\.env"
  Write-Host "Created frontend\.env from example."
}

if (-not (Test-Path ".\backend\.env.test")) {
  Copy-Item ".\backend\.env.test.example" ".\backend\.env.test"
  Write-Host "Created backend\.env.test from example."
}

npm install
npm run install:all

Write-Host "Setup complete."
