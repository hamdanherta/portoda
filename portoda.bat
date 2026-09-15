@echo off
echo Running pnpm build...
call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] pnpm build failed! Aborting php artisan serve.
    exit /b %ERRORLEVEL%
)
echo.
echo Starting Laravel server...
php artisan serve
