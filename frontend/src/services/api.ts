// API Service for MixFade backend communication
export interface EmailCollectionRequest {
  email: string;
  platform: string;
  version: string;
  userAgent?: string;
  referrer?: string;
}

export interface EmailCollectionResponse {
  success: boolean;
  sessionId: string;
  message: string;
  customer?: {
    exists: boolean;
    added: boolean;
  };
  error?: string;
}

export interface DownloadTrackingRequest {
  sessionId: string;
  email: string;
  platform: string;
  version: string;
  downloadUrl: string;
  userAgent?: string;
}

export interface DownloadTrackingResponse {
  success: boolean;
  downloadId: string;
  message: string;
  error?: string;
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  // Email collection endpoint
  async collectEmail(data: EmailCollectionRequest): Promise<EmailCollectionResponse> {
    const response = await fetch(`${this.baseUrl}/api/email/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email.toLowerCase().trim(),
        platform: data.platform,
        version: data.version,
        userAgent: data.userAgent || navigator.userAgent,
        referrer: data.referrer || window.location.href
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return response.json();
  }

  // Download tracking endpoint
  async trackDownload(data: DownloadTrackingRequest): Promise<DownloadTrackingResponse> {
    const response = await fetch(`${this.baseUrl}/api/download/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: data.sessionId,
        email: data.email,
        platform: data.platform,
        version: data.version,
        downloadUrl: data.downloadUrl,
        userAgent: data.userAgent || navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Download tracking failed: ${response.status}`);
    }

    return response.json();
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/api/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return response.json();
  }

  // Get download URL (this will be the direct download link)
  getDownloadUrl(platform: string, version: string): string {
    // These would be your actual download URLs
    const downloadUrls = {
      windows: `https://mixfade.s3.us-east-1.amazonaws.com/releases/windows/MixFade+Setup+${version}.exe`,
      // Add other platforms if needed in the future
    };

    return downloadUrls[platform.toLowerCase() as keyof typeof downloadUrls] || downloadUrls.windows;
  }

  // Utility method to trigger download
  async initiateDownload(sessionId: string, email: string, platform: string, version: string): Promise<void> {
    const downloadUrl = this.getDownloadUrl(platform, version);
    
    try {
      // Track the download
      await this.trackDownload({
        sessionId,
        email,
        platform,
        version,
        downloadUrl
      });
    } catch (error) {
      console.warn('Download tracking failed:', error);
      // Don't block the download if tracking fails
    }

    // Trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `MixFade-${version}-${platform}.exe`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export individual functions for easier importing
export const collectEmail = (data: EmailCollectionRequest) => apiService.collectEmail(data);
export const trackDownload = (data: DownloadTrackingRequest) => apiService.trackDownload(data);
export const initiateDownload = (sessionId: string, email: string, platform: string, version: string) => 
  apiService.initiateDownload(sessionId, email, platform, version);
export const healthCheck = () => apiService.healthCheck();