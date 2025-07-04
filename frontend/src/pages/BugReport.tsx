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
  // Initialize Formspree with your endpoint
  const [state, handleFormspreeSubmit] = useForm("manjkjbk");
  const { toast } = useToast();

  // Local form state for controlled inputs
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit to Formspree
    await handleFormspreeSubmit(e);
    
    // Show toast on successful submission
    if (state.succeeded) {
      toast({
        title: "Bug Report Submitted Successfully!",
        description: "Thank you for your report! We'll investigate and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        version: "",
        description: "",
        stepsToReproduce: ""
      });
    }
  };

  // Show success message if form was submitted successfully
  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20">
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="mr-3 h-12 w-12 text-emerald-400" />
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-gradient-emerald-purple">Thank You!</span>
              </h1>
            </div>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Your bug report has been submitted successfully. We'll investigate the issue and get back to you soon.
            </p>
            
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold"
            >
              Submit Another Report
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Bug className="mr-3 h-12 w-12 text-purple-400" />
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-gradient-emerald-purple">Report a Bug</span>
            </h1>
          </div>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Found an issue? Help the product level up by reporting bugs.
          </p>
        </div>
      </section>

      {/* Bug Report Form */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 border border-slate-700/50 neon-glow-fusion">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    placeholder="Your name"
                    required
                  />
                  <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                    className="text-red-400 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    placeholder="your@email.com"
                    required
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-red-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    placeholder="Brief description of the issue"
                    required
                  />
                  <ValidationError 
                    prefix="Subject" 
                    field="subject"
                    errors={state.errors}
                    className="text-red-400 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="version" className="text-white">Version</Label>
                  <Input
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    placeholder="e.g., v2.1.0"
                  />
                  <ValidationError 
                    prefix="Version" 
                    field="version"
                    errors={state.errors}
                    className="text-red-400 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 min-h-[120px]"
                  placeholder="Describe the bug or issue you encountered..."
                  required
                />
                <ValidationError 
                  prefix="Description" 
                  field="description"
                  errors={state.errors}
                  className="text-red-400 text-sm"
                />
              </div>
              {/* Display general form errors */}
              {state.errors && state.errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">
                    There was an error submitting your form. Please try again.
                  </p>
                </div>
              )}

              <Button 
                type="submit"
                size="lg"
                disabled={state.submitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold py-4 text-lg neon-glow-fusion disabled:opacity-50 disabled:cursor-not-allowed"
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
