import { useState } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bug, Send, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

const BugReport = () => {
  const [state, handleFormspreeSubmit] = useForm("manjkjbk");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    version: "",
    description: "",
    stepsToReproduce: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleFormspreeSubmit(e);

    if (state.succeeded) {
      toast({
        title: "Bug Report Submitted Successfully!",
        description: "Thank you for your report! We'll investigate and get back to you soon.",
      });
      setFormData({
        name: "", email: "", subject: "", version: "",
        description: "", stepsToReproduce: ""
      });
    }
  };

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 noise-bg relative">
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[140px]" />
          </div>

          <div className="container mx-auto text-center relative z-10">
            <div className="flex items-center justify-center mb-6 animate-reveal">
              <CheckCircle className="mr-3 h-10 w-10 text-emerald-400" />
              <h1 className="font-display text-5xl md:text-6xl font-bold">
                <span className="text-gradient-emerald-purple">Thank You!</span>
              </h1>
            </div>

            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto animate-reveal delay-1">
              Your bug report has been submitted successfully. We'll investigate the issue and get back to you soon.
            </p>

            <div className="animate-reveal delay-2">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold transition-all duration-300"
              >
                Submit Another Report
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20 noise-bg relative">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-6 animate-reveal">
            <Bug className="mr-3 h-10 w-10 text-purple-400" />
            <h1 className="font-display text-5xl md:text-6xl font-bold">
              <span className="text-gradient-emerald-purple">Report a Bug</span>
            </h1>
          </div>

          <p className="text-lg text-slate-400 mb-0 max-w-2xl mx-auto animate-reveal delay-1">
            Found an issue? Help the project level up by reporting bugs.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* Bug Report Form */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 border border-slate-700/30 neon-glow-fusion animate-reveal-scale delay-2">
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white text-sm font-medium">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
                    placeholder="Your name"
                    required
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
                    placeholder="your@email.com"
                    required
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white text-sm font-medium">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
                    placeholder="Brief description of the issue"
                    required
                  />
                  <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-400 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version" className="text-white text-sm font-medium">Version</Label>
                  <Input
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
                    placeholder="e.g., v2.1.0"
                  />
                  <ValidationError prefix="Version" field="version" errors={state.errors} className="text-red-400 text-sm" />
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <Label htmlFor="description" className="text-white text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 min-h-[120px]"
                  placeholder="Describe the bug or issue you encountered..."
                  required
                />
                <ValidationError prefix="Description" field="description" errors={state.errors} className="text-red-400 text-sm" />
              </div>

              {state.errors && Object.keys(state.errors).length > 0 && (
                <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">
                    There was an error submitting your form. Please try again.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={state.submitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold py-4 text-lg neon-glow-fusion disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <Send className="mr-2 h-5 w-5" />
                {state.submitting ? "Submitting..." : "Submit Bug Report"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BugReport;
