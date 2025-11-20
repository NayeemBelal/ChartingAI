/**
 * Cloud Storage Integration Utilities
 * Google Drive and Dropbox file picker integrations
 */

declare global {
  interface Window {
    gapi: any;
    google: any;
    Dropbox: any;
  }
}

// Configuration from environment variables
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const DROPBOX_APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY || '';

export interface CloudFile {
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
  id?: string;
  provider: 'google' | 'dropbox';
}

/**
 * Load Dropbox Chooser SDK dynamically
 */
export function loadDropboxSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Dropbox) {
      resolve();
      return;
    }

    if (!DROPBOX_APP_KEY || DROPBOX_APP_KEY === '') {
      reject(new Error('Dropbox App Key not configured. Please set VITE_DROPBOX_APP_KEY in your .env file.'));
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.dropbox.com/static/api/2/dropins.js';
    script.id = 'dropboxjs';
    script.setAttribute('data-app-key', DROPBOX_APP_KEY);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Dropbox SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Initialize Google Picker API
 */
export async function initializeGooglePicker(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === '') {
      console.warn('Google Client ID not configured');
      resolve(false);
      return;
    }
    if (!window.gapi || !window.google) {
      console.error('Google APIs not loaded');
      resolve(false);
      return;
    }
    // Load both client and picker modules
    window.gapi.load('client:picker', {
      callback: async () => {
        try {
          await window.gapi.client.init({ apiKey: GOOGLE_API_KEY });
          resolve(true);
        } catch (err) {
          console.error('Failed to init gapi client:', err);
          resolve(false);
        }
      },
      onerror: () => resolve(false),
    });
  });
}

/**
 * Open Google Drive Picker
 */
export async function openGoogleDrivePicker(
  onFileSelected: (file: CloudFile) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    if (!GOOGLE_API_KEY || !GOOGLE_CLIENT_ID) {
      throw new Error('Google API credentials not configured. Please set VITE_GOOGLE_API_KEY and VITE_GOOGLE_CLIENT_ID in your .env file.');
    }

    // Check if APIs are loaded
    if (!window.gapi || !window.google) {
      throw new Error('Google APIs not loaded. Please refresh the page and try again.');
    }

    // Initialize picker
    const initialized = await initializeGooglePicker();
    if (!initialized) {
      throw new Error('Failed to initialize Google Picker. Please check your API configuration.');
    }

    // Get OAuth token using Google Identity Services (token client)
    // Keep a user-gesture popup open to avoid popup blockers (Safari/ITP)
    const gesturePopup = window.open("", "_blank", "width=420,height=540");
    const token = await new Promise<string>((resolveToken, rejectToken) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: (resp: any) => {
            if (resp && resp.access_token) resolveToken(resp.access_token);
            else rejectToken(new Error('Failed to acquire access token'));
          },
          // Nudge explicit consent to reduce silent mode issues
          prompt: 'consent',
        });
        client.requestAccessToken();
      } catch (e) {
        rejectToken(e);
      }
    });
    // Close the placeholder popup if we opened it
    try { gesturePopup?.close(); } catch {}

    // Create picker
    const picker = new window.google.picker.PickerBuilder()
      .setOAuthToken(token)
      .setDeveloperKey(GOOGLE_API_KEY)
      .setCallback((data: any) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          const doc = data[window.google.picker.Response.DOCUMENTS][0];
          
          // Get download URL
          const downloadUrl = `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`;
          
          const file: CloudFile = {
            name: doc.name,
            url: downloadUrl,
            size: doc.sizeBytes,
            mimeType: doc.mimeType,
            id: doc.id,
            provider: 'google',
          };
          onFileSelected(file);
        } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
          // User cancelled
        }
      })
      .addView(window.google.picker.ViewId.DOCS)
      .setSelectableMimeTypes('audio/wav,audio/mp3,audio/mpeg,audio/*')
      .setOrigin(window.location.origin)
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .build();

    picker.setVisible(true);
  } catch (error) {
    console.error('Error opening Google Drive picker:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to open Google Drive';
    if (onError) {
      onError(new Error(errorMessage));
    } else {
      throw new Error(errorMessage);
    }
  }
}

/**
 * Open Dropbox Chooser
 */
export async function openDropboxChooser(
  onFileSelected: (file: CloudFile) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    // Load SDK if not already loaded
    await loadDropboxSDK();

    if (!window.Dropbox) {
      throw new Error('Dropbox SDK not available');
    }

    window.Dropbox.choose({
      success: (files: any[]) => {
        if (files && files.length > 0) {
          const file = files[0];
          const cloudFile: CloudFile = {
            name: file.name,
            url: file.link,
            size: file.bytes,
            mimeType: file.mimeType || 'audio/mpeg',
            id: file.id,
            provider: 'dropbox',
          };
          onFileSelected(cloudFile);
        }
      },
      cancel: () => {
        // User cancelled - no action needed
      },
      linkType: 'direct',
      multiselect: false,
      extensions: ['.wav', '.mp3', '.m4a', '.aac', '.ogg', '.flac'],
      folderselect: false,
    });
  } catch (error) {
    console.error('Error opening Dropbox chooser:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to open Dropbox';
    if (onError) {
      onError(new Error(errorMessage));
    } else {
      throw new Error(errorMessage);
    }
  }
}

/**
 * Download file from cloud storage URL
 */
export async function downloadCloudFile(file: CloudFile): Promise<File> {
  try {
    // For Google Drive, we need to use the download URL with the access token
    let downloadUrl = file.url;
    
    if (file.provider === 'google' && file.id) {
      // Google Drive files need to be downloaded with the access token
      // This is a simplified version - in production, you'd want to handle this server-side
      downloadUrl = file.url;
    }

    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: file.provider === 'google' ? {
        // Best-effort: pass token if available via GIS Cache (not guaranteed in client-only)
        'Authorization': `Bearer ${(window as any).google?.accounts?.oauth2?.hasGrantedAllScopes ? '' : ''}`
      } : {}
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new File([blob], file.name, { type: file.mimeType || 'audio/mpeg' });
  } catch (error) {
    console.error('Error downloading cloud file:', error);
    throw error;
  }
}

