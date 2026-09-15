Write-Host "Running pnpm build..." -ForegroundColor Cyan
pnpm build
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nStarting Laravel server..." -ForegroundColor Green
    php artisan serve
} else {
    Write-Host "`n[ERROR] pnpm build failed! Aborting php artisan serve." -ForegroundColor Red
}
