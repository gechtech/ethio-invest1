@echo off
echo ========================================
echo Simple Build for Beginners
echo ========================================
echo.

echo Creating dist folder...
if not exist "dist" mkdir dist

echo Copying files...
copy "index.html" "dist\"
xcopy "src" "dist\src\" /E /I /Y
if exist "public" xcopy "public" "dist\public\" /E /I /Y

echo.
echo ✅ Simple build completed!
echo.
echo Your files are in the 'dist' folder.
echo You can now upload this folder to Netlify.
echo.
echo Next steps:
echo 1. Go to https://app.netlify.com/
echo 2. Click "Add new site"
echo 3. Choose "Deploy manually"
echo 4. Drag and drop the 'dist' folder
echo.
pause 