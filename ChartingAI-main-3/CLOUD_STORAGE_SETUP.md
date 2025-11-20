# Cloud Storage Integration Setup

This application supports uploading audio files from Google Drive and Dropbox.

## Setup Instructions

### Google Drive Integration

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable APIs**
   - Enable the **Google Drive API**
   - Enable the **Google Picker API**

3. **Create Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API Key
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins: `http://localhost:5173` (for development)
   - Add authorized redirect URIs: `http://localhost:5173` (for development)
   - Copy your Client ID

4. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_API_KEY=your_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

### Dropbox Integration

1. **Create a Dropbox App**
   - Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
   - Click "Create app"
   - Choose "Dropbox API"
   - Choose "Full Dropbox" or "App folder" access
   - Name your app
   - Copy your App Key

2. **Configure Environment Variables**
   Add to your `.env` file:
   ```env
   VITE_DROPBOX_APP_KEY=your_dropbox_app_key_here
   ```

## Usage

Once configured, users can:
1. Click "Google Drive" button to select files from Google Drive
2. Click "Dropbox" button to select files from Dropbox
3. Selected files will be automatically downloaded and prepared for transcription

## Notes

- For production, make sure to update authorized origins and redirect URIs in Google Cloud Console
- Dropbox Chooser requires the app to be approved for production use
- Files are downloaded to the browser before being submitted for transcription
- Audio file formats supported: .wav, .mp3, .m4a, .aac, .ogg, .flac

