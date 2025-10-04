try {
    # Use dynamic host for mobile compatibility
    $baseUrl = if ($env:EXTENSION_BUILDER_URL) { $env:EXTENSION_BUILDER_URL } else { "http://localhost:3000" }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/screenshots?out=session" -Method GET
    Write-Host "API Response:"
    $response | ConvertTo-Json -Depth 3
    
    if ($response.images -and $response.images.Count -gt 0) {
        Write-Host "Found $($response.images.Count) screenshots"
        Write-Host "First few images:"
        $response.images[0..2] | ForEach-Object { Write-Host "  - $_" }
    } else {
        Write-Host "No screenshots found"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
