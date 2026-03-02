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

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

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
    setError('');

    if (!email) { setError('Email address is required'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email address'); return; }

    setIsSubmitting(true);
    try {
      const result = await handleEmailCollection(email);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(result.sessionId);
          onClose();
          setTimeout(() => { setIsSuccess(false); setFormData({ email: '' }); }, 300);
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
    if (error) setError('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setTimeout(() => { setFormData({ email: '' }); setError(''); setIsSuccess(false); }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-panel border border-slate-700/30 neon-glow-fusion max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-emerald-500/15 to-purple-500/15 rounded-2xl flex items-center justify-center">
            {isSuccess ? (
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            ) : (
              <img
                src="/OS_Initials_Icon_transparent.png"
                alt="OpaqueSound"
                className="w-8 h-8 object-contain"
              />
            )}
          </div>

          <DialogTitle className="font-display text-2xl font-bold text-white">
            {isSuccess ? 'Success!' : (
              <>Get Your <span className="text-gradient-emerald-purple">Free Download</span></>
            )}
          </DialogTitle>

          <DialogDescription className="text-slate-400 mt-2 text-sm">
            {isSuccess
              ? 'Your download will start shortly...'
              : `Enter your email to download MixFade v${version} for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 text-emerald-400 text-lg font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>Thank you!</span>
              </div>
            </div>
            <p className="text-slate-400 mb-4 text-sm">Your download will begin automatically.</p>
            <div className="flex items-center justify-center space-x-2 text-emerald-400">
              <Download className="w-4 h-4" />
              <span className="text-sm">Preparing download...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 transition-all"
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
            <div className="bg-slate-800/20 rounded-lg p-4 border border-slate-700/20">
              <h4 className="text-white font-medium mb-2 text-xs tracking-wider uppercase">What you'll get</h4>
              <ul className="space-y-1.5 text-slate-400 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-500/60">›</span>
                  <span>Instant download access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-500/60">›</span>
                  <span>Updates & new features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-500/60">›</span>
                  <span>Exclusive sample packs and MIDIs</span>
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
                className="flex-1 border-slate-700/50 text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all"
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

            <p className="text-[11px] text-slate-600 text-center">
              We respect your privacy. No spam, unsubscribe anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailGateModal;