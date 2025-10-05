# Quick Fix Script for CORS and Environment Variables
# Run this after updating SecurityConfig.java in the backend project

Write-Host "`n╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           🔧 CORS & ENV FIX INSTRUCTIONS 🔧             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📋 STEP-BY-STEP FIX GUIDE`n" -ForegroundColor Yellow

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "PART 1: UPDATE BACKEND (Spring Boot)" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

Write-Host "  1️⃣  Copy SecurityConfig-UPDATED.java to backend:" -ForegroundColor White
Write-Host "      Source: somdelie-posv1\SecurityConfig-UPDATED.java" -ForegroundColor Gray
Write-Host "      Destination: somdelie-pos\src\main\java\com\somdelie_pos\somdelie_pos\configuration\SecurityConfig.java" -ForegroundColor Gray
Write-Host ""

Write-Host "  2️⃣  Navigate to backend directory:" -ForegroundColor White
Write-Host "      cd C:\Users\dell\Desktop\java-builds\somdelie-pos" -ForegroundColor Gray
Write-Host ""

Write-Host "  3️⃣  Build the project:" -ForegroundColor White
Write-Host "      mvn clean package -DskipTests" -ForegroundColor Gray
Write-Host ""

Write-Host "  4️⃣  Build and push Docker image:" -ForegroundColor White
Write-Host "      docker build -t somdelie/somdelie-pos:2.0.2 ." -ForegroundColor Gray
Write-Host "      docker tag somdelie/somdelie-pos:2.0.2 somdelie/somdelie-pos:latest" -ForegroundColor Gray
Write-Host "      docker push somdelie/somdelie-pos:2.0.2" -ForegroundColor Gray
Write-Host "      docker push somdelie/somdelie-pos:latest" -ForegroundColor Gray
Write-Host ""

Write-Host "  5️⃣  Add environment variable on Render:" -ForegroundColor White
Write-Host "      • Go to render.com/dashboard" -ForegroundColor Gray
Write-Host "      • Click 'somdelie-pos' service" -ForegroundColor Gray
Write-Host "      • Environment tab → Add variable:" -ForegroundColor Gray
Write-Host "        Key: ALLOWED_ORIGINS" -ForegroundColor Cyan
Write-Host "        Value: http://localhost:5173,http://localhost:3000,https://somdelie-posv1.vercel.app,https://somdelie-posv1-hgpco1oyv-somdelies-projects.vercel.app" -ForegroundColor Cyan
Write-Host "      • Save and deploy" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "PART 2: UPDATE FRONTEND (Next.js on Vercel)" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

Write-Host "  6️⃣  Get your backend URL from Render:" -ForegroundColor White
Write-Host "      • Go to render.com/dashboard" -ForegroundColor Gray
Write-Host "      • Click 'somdelie-pos' service" -ForegroundColor Gray
Write-Host "      • Copy the URL (e.g., https://somdelie-pos.onrender.com)" -ForegroundColor Gray
Write-Host ""

Write-Host "  7️⃣  Set environment variable on Vercel:" -ForegroundColor White
Write-Host "      • Go to vercel.com/dashboard" -ForegroundColor Gray
Write-Host "      • Click 'somdelie-posv1' project" -ForegroundColor Gray
Write-Host "      • Settings → Environment Variables → Add:" -ForegroundColor Gray
Write-Host "        Name: NEXT_PUBLIC_API_URL" -ForegroundColor Cyan
Write-Host "        Value: https://your-backend.onrender.com" -ForegroundColor Cyan
Write-Host "        Environments: ✓ Production ✓ Preview ✓ Development" -ForegroundColor Gray
Write-Host "      • Save" -ForegroundColor Gray
Write-Host ""

Write-Host "  8️⃣  Redeploy on Vercel:" -ForegroundColor White
Write-Host "      • Deployments tab → ⋯ → Redeploy" -ForegroundColor Gray
Write-Host "      OR" -ForegroundColor Yellow
Write-Host "      • Git commit and push (auto-redeploys)" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "TESTING" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

Write-Host "  9️⃣  After both deployments complete:" -ForegroundColor White
Write-Host "      • Open your Vercel app" -ForegroundColor Gray
Write-Host "      • Open browser console (F12)" -ForegroundColor Gray
Write-Host "      • Try to login" -ForegroundColor Gray
Write-Host "      • Should work without CORS errors! ✅" -ForegroundColor Green
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

Write-Host "📖 Full documentation: CORS-FIX-GUIDE.md`n" -ForegroundColor Cyan

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Follow these steps carefully for a complete fix! 🚀   ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

# Offer to copy the SecurityConfig file
$sourcePath = "C:\Users\dell\Desktop\java-builds\somdelie-posv1\SecurityConfig-UPDATED.java"
$destPath = "C:\Users\dell\Desktop\java-builds\somdelie-pos\src\main\java\com\somdelie_pos\somdelie_pos\configuration\SecurityConfig.java"

Write-Host "Would you like me to copy the updated SecurityConfig.java now? (Y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "`n✅ SecurityConfig.java has been updated!`n" -ForegroundColor Green
        Write-Host "Next: Run the Maven build commands listed above.`n" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Source file not found. Please copy manually.`n" -ForegroundColor Red
    }
} else {
    Write-Host "`n📝 Remember to copy SecurityConfig-UPDATED.java manually to your backend project.`n" -ForegroundColor Yellow
}
