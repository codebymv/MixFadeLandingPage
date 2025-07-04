import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Download, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { collectEmail, type EmailCollectionResponse } from "@/services/api";

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sessionId: string) => void;
  platform?: string;
  version?: string;
}

interface FormData {
  email: string;
}

const EmailGateModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  platform = 'windows', 
  version = '0.9.4' 
}: EmailGateModalProps) => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // API call to collect email using the service
  const handleEmailCollection = async (email: string): Promise<EmailCollectionResponse> => {
    return collectEmail({
      email,
      platform: platform || 'windows',
      version: version || '0.9.4',
      userAgent: navigator.userAgent,
      referrer: window.location.href
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = formData.email.trim();
    
    // Reset states
    setError('');
    
    // Validation
    if (!email) {
      setError('Email address is required');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await handleEmailCollection(email);
      
      if (result.success) {
        setIsSuccess(true);
        
        // Show success message briefly before triggering download
        setTimeout(() => {
          onSuccess(result.sessionId);
          onClose();
          
          // Reset modal state after closing
          setTimeout(() => {
            setIsSuccess(false);
            setFormData({ email: '' });
          }, 300);
        }, 1500);
      } else {
        setError(result.error || 'Failed to process email. Please try again.');
      }
    } catch (err) {
      console.error('Email collection failed:', err);
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form after modal closes
      setTimeout(() => {
        setFormData({ email: '' });
        setError('');
        setIsSuccess(false);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-panel border border-slate-700/50 neon-glow-fusion max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
            {isSuccess ? (
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            ) : (
              <img 
                src="/OS_Initials_Icon_transparent.png" 
                alt="OpaqueSound" 
                className="w-10 h-10 object-contain"
              />
            )}
          </div>
          
          <DialogTitle className="text-2xl font-bold text-white">
            {isSuccess ? 'Success!' : (
              <>
                Get Your <span className="text-gradient-emerald-purple">Free Download</span>
              </>
            )}
          </DialogTitle>
          
          <DialogDescription className="text-slate-300 mt-2">
            {isSuccess 
              ? 'Your download will start shortly...'
              : `Enter your email to download MixFade v${version} for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          // Success State
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 text-emerald-400 text-lg font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>Email received!</span>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              Thank you for downloading MixFade. Your download will begin automatically.
            </p>
            <div className="flex items-center justify-center space-x-2 text-emerald-400">
              <Download className="w-4 h-4" />
              <span className="text-sm">Preparing download...</span>
            </div>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
              />
              
              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
              <h4 className="text-white font-medium mb-2 text-sm">What you'll get:</h4>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">•</span>
                  <span>Instant download access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">•</span>
                  <span>Updates & new features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">•</span>
                  <span>Tips & audio production guides</span>
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting || !formData.email.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold neon-glow-fusion transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Get Download
                  </>
                )}
              </Button>
            </div>

            {/* Privacy Notice */}
            <p className="text-xs text-slate-400 text-center">
              We respect your privacy. No spam, unsubscribe anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailGateModal; 