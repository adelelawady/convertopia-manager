# Create directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "public/ffmpeg"

# Download FFmpeg files
$files = @(
    @{
        url = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.js"
        output = "public/ffmpeg/ffmpeg-core.js"
    },
    @{
        url = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.wasm"
        output = "public/ffmpeg/ffmpeg-core.wasm"
    },
    @{
        url = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.worker.js"
        output = "public/ffmpeg/ffmpeg-core.worker.js"
    }
)

foreach ($file in $files) {
    Write-Host "Downloading $($file.url) to $($file.output)"
    Invoke-WebRequest -Uri $file.url -OutFile $file.output
}

Write-Host "FFmpeg files downloaded successfully" 