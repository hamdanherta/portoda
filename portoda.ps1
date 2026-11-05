Write-Host "Starting Vite Dev Server and Laravel server concurrently..." -ForegroundColor Cyan
npx concurrently --kill-others -n "VITE,LARAVEL" -c "cyan,green" "pnpm dev" "php artisan serve"
