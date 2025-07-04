import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Menu, X, Star, CheckCircle, Phone, Mail, MapPin, 
  Printer, Scissors, Monitor, Zap, Award, Users, 
  TrendingUp, Clock, Shield, ArrowRight, ChevronDown,
  Target, Settings, Headphones, BookOpen
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [franchisePlans, setFranchisePlans] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contact');

  const { register: registerContact, handleSubmit: handleSubmitContact, reset: resetContact } = useForm();
  const { register: registerFranchise, handleSubmit: handleSubmitFranchise, reset: resetFranchise } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansResponse, equipmentResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/franchise-plans`),
        axios.get(`${BACKEND_URL}/api/equipment`)
      ]);
      setFranchisePlans(plansResponse.data);
      setEquipment(equipmentResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const onSubmitContact = async (data) => {
    try {
      await axios.post(`${BACKEND_URL}/api/contact`, data);
      toast.success('Contact inquiry submitted successfully!');
      resetContact();
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast.error('Failed to submit contact inquiry');
    }
  };

  const onSubmitFranchise = async (data) => {
    try {
      await axios.post(`${BACKEND_URL}/api/franchise-application`, data);
      toast.success('Franchise application submitted successfully!');
      resetFranchise();
    } catch (error) {
      console.error('Error submitting franchise application:', error);
      toast.error('Failed to submit franchise application');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Michele Aranha Personalizados</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-primary-600 transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection('equipment')} className="text-gray-700 hover:text-primary-600 transition-colors">
                Equipment
              </button>
              <button onClick={() => scrollToSection('plans')} className="text-gray-700 hover:text-primary-600 transition-colors">
                Plans
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-primary-600 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className="btn-primary">
                Get Started
              </button>
            </nav>
            
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left text-gray-700 hover:text-primary-600 transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection('equipment')} className="block w-full text-left text-gray-700 hover:text-primary-600 transition-colors">
                Equipment
              </button>
              <button onClick={() => scrollToSection('plans')} className="block w-full text-left text-gray-700 hover:text-primary-600 transition-colors">
                Plans
              </button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-700 hover:text-primary-600 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className="btn-primary w-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="franchise-hero min-h-screen flex items-center justify-center text-white relative overflow-hidden">
        <div className="floating-elements">
          <div className="floating-element top-20 left-10">
            <Printer className="w-16 h-16" />
          </div>
          <div className="floating-element top-40 right-20">
            <Scissors className="w-12 h-12" />
          </div>
          <div className="floating-element bottom-40 left-20">
            <Monitor className="w-14 h-14" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 font-heading">
              Transform Your Future with
              <span className="block text-gradient">Premium Stationery Franchise</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Join the Michele Aranha Personalizados franchise family and build a profitable business 
              with our complete equipment package, comprehensive training, and ongoing support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => scrollToSection('plans')} className="btn-primary text-lg px-8 py-4">
                View Franchise Plans
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button onClick={() => scrollToSection('contact')} className="btn-secondary text-lg px-8 py-4">
                Request Information
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="stats-counter">50+</div>
              <p className="text-gray-600 font-medium">Successful Franchises</p>
            </div>
            <div className="animate-slide-up">
              <div className="stats-counter">98%</div>
              <p className="text-gray-600 font-medium">Success Rate</p>
            </div>
            <div className="animate-slide-up">
              <div className="stats-counter">15+</div>
              <p className="text-gray-600 font-medium">Years Experience</p>
            </div>
            <div className="animate-slide-up">
              <div className="stats-counter">24/7</div>
              <p className="text-gray-600 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section id="equipment" className="section-padding bg-gray-50">
        <div className="container">
          <h2 className="section-title">Professional Equipment Package</h2>
          <p className="section-subtitle">
            Our comprehensive equipment package includes everything you need to start and run a successful stationery business
          </p>
          
          <div className="equipment-grid">
            {equipment.slice(0, 8).map((item, index) => (
              <div key={item.id} className="card p-6 animate-slide-up">
                <div className="mb-4">
                  <img 
                    src={
                      item.category === 'printing' 
                        ? 'https://images.unsplash.com/photo-1708793699492-5fa208f52dcb?auto=format&fit=crop&w=400&q=80'
                        : item.category === 'pressing' 
                        ? 'https://images.pexels.com/photos/5845934/pexels-photo-5845934.jpeg?auto=compress&cs=tinysrgb&w=400'
                        : item.category === 'cutting' 
                        ? 'https://images.pexels.com/photos/7254422/pexels-photo-7254422.jpeg?auto=compress&cs=tinysrgb&w=400'
                        : 'https://images.pexels.com/photos/6894103/pexels-photo-6894103.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="space-y-2">
                  {Object.entries(item.specifications).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-medium">{Array.isArray(value) ? value.join(', ') : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Plans Section */}
      <section id="plans" className="section-padding bg-white">
        <div className="container">
          <h2 className="section-title">Choose Your Franchise Plan</h2>
          <p className="section-subtitle">
            Select the perfect plan for your business goals and investment capacity
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {franchisePlans.map((plan) => (
              <div key={plan.id} className={`card plan-card p-6 ${plan.popular ? 'popular' : ''} animate-slide-up`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    ${plan.price.toLocaleString()}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Setup Fee:</span>
                    <span className="font-medium">${plan.setup_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Royalty:</span>
                    <span className="font-medium">${plan.monthly_royalty.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Training Hours:</span>
                    <span className="font-medium">{plan.training_hours}h</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => scrollToSection('contact')}
                  className={`w-full ${plan.popular ? 'btn-accent' : 'btn-primary'}`}
                >
                  Choose This Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <h2 className="section-title">Why Choose Our Franchise?</h2>
          <p className="section-subtitle">
            We provide everything you need for a successful stationery business
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up">
              <div className="feature-icon mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Proven Success</h3>
              <p className="text-gray-600">
                Join a franchise with 15+ years of experience and 98% success rate
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="feature-icon mx-auto">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Get round-the-clock support from our experienced team
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="feature-icon mx-auto">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">High ROI</h3>
              <p className="text-gray-600">
                Achieve profitability quickly with our proven business model
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="feature-icon mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Comprehensive Training</h3>
              <p className="text-gray-600">
                Get extensive training on equipment, operations, and business management
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="feature-icon mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Territory Protection</h3>
              <p className="text-gray-600">
                Secure your market with exclusive territory rights
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="feature-icon mx-auto">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Marketing Support</h3>
              <p className="text-gray-600">
                Benefit from our professional marketing materials and campaigns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="section-title">Simple 4-Step Process</h2>
          <p className="section-subtitle">
            From application to grand opening in just 45-60 days
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="process-step">
              <h3 className="text-xl font-semibold mb-2">Apply & Get Approved</h3>
              <p className="text-gray-600">
                Submit your application and get approved within 48 hours
              </p>
            </div>
            
            <div className="process-step">
              <h3 className="text-xl font-semibold mb-2">Equipment Delivery</h3>
              <p className="text-gray-600">
                Receive your complete equipment package and setup support
              </p>
            </div>
            
            <div className="process-step">
              <h3 className="text-xl font-semibold mb-2">Training & Support</h3>
              <p className="text-gray-600">
                Complete comprehensive training on all equipment and operations
              </p>
            </div>
            
            <div className="process-step">
              <h3 className="text-xl font-semibold mb-2">Grand Opening</h3>
              <p className="text-gray-600">
                Launch your business with our marketing support and guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl font-bold mb-6 font-heading">
                About Michele Aranha Personalizados
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                With over 15 years of experience in the stationery and personalization industry, 
                Michele Aranha Personalizados has become a trusted name in custom printing and 
                stationery solutions.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our franchise model provides entrepreneurs with everything they need to start 
                and grow a successful business, from state-of-the-art equipment to comprehensive 
                training and ongoing support.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="card p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-2">50+</div>
                  <p className="text-sm text-gray-600">Successful Franchises</p>
                </div>
                <div className="card p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-2">15+</div>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-up">
              <img 
                src="https://images.pexels.com/photos/9574569/pexels-photo-9574569.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Professional printing facility"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="container">
          <h2 className="section-title">Get Started Today</h2>
          <p className="section-subtitle">
            Ready to transform your future? Contact us to learn more about our franchise opportunities
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <div className="contact-form p-8 rounded-2xl">
                <div className="flex mb-6">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`flex-1 py-3 px-4 rounded-l-lg font-medium transition-colors ${
                      activeTab === 'contact' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    General Inquiry
                  </button>
                  <button
                    onClick={() => setActiveTab('franchise')}
                    className={`flex-1 py-3 px-4 rounded-r-lg font-medium transition-colors ${
                      activeTab === 'franchise' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Franchise Application
                  </button>
                </div>
                
                {activeTab === 'contact' ? (
                  <form onSubmit={handleSubmitContact(onSubmitContact)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...registerContact('name', { required: true })}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...registerContact('email', { required: true })}
                        className="form-input"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...registerContact('phone', { required: true })}
                        className="form-input"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        {...registerContact('message', { required: true })}
                        rows={4}
                        className="form-textarea"
                        placeholder="Tell us about your interest in our franchise..."
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      Send Message
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitFranchise(onSubmitFranchise)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          {...registerFranchise('name', { required: true })}
                          className="form-input"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...registerFranchise('email', { required: true })}
                          className="form-input"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          {...registerFranchise('phone', { required: true })}
                          className="form-input"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Investment Capacity
                        </label>
                        <select
                          {...registerFranchise('investment_capacity', { required: true })}
                          className="form-input"
                        >
                          <option value="">Select investment range</option>
                          <option value="25000">$25,000 - $45,000</option>
                          <option value="50000">$45,000 - $75,000</option>
                          <option value="75000">$75,000 - $100,000</option>
                          <option value="100000">$100,000+</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          {...registerFranchise('city', { required: true })}
                          className="form-input"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          {...registerFranchise('state', { required: true })}
                          className="form-input"
                          placeholder="Enter your state"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Plan
                      </label>
                      <select
                        {...registerFranchise('preferred_plan', { required: true })}
                        className="form-input"
                      >
                        <option value="">Select a plan</option>
                        <option value="starter">Starter Package ($25,000)</option>
                        <option value="professional">Professional Package ($45,000)</option>
                        <option value="premium">Premium Package ($70,000)</option>
                        <option value="enterprise">Enterprise Package ($100,000)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Experience
                      </label>
                      <textarea
                        {...registerFranchise('business_experience', { required: true })}
                        rows={3}
                        className="form-textarea"
                        placeholder="Tell us about your business experience..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Message (Optional)
                      </label>
                      <textarea
                        {...registerFranchise('message')}
                        rows={3}
                        className="form-textarea"
                        placeholder="Any additional information or questions..."
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      Submit Application
                    </button>
                  </form>
                )}
              </div>
            </div>
            
            <div className="animate-slide-up">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 font-heading">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-primary-600 mr-3" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-primary-600 mr-3" />
                      <span>franchise@micheleaanhapersonalizados.com</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                      <span>123 Business Ave, Suite 100, City, State 12345</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-6 font-heading">
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
                  <h4 className="text-lg font-semibold mb-2">Ready to Start?</h4>
                  <p className="text-gray-600 mb-4">
                    Our franchise specialists are ready to answer your questions and help you get started.
                  </p>
                  <button className="btn-primary">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Michele Aranha Personalizados</span>
              </div>
              <p className="text-gray-400">
                Building successful stationery franchises since 2008
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('equipment')} className="hover:text-white transition-colors">
                    Equipment
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('plans')} className="hover:text-white transition-colors">
                    Plans
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">
                    About
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Franchise Opportunities</li>
                <li>Equipment Training</li>
                <li>Business Support</li>
                <li>Marketing Materials</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>+1 (555) 123-4567</p>
                <p>franchise@micheleaanhapersonalizados.com</p>
                <p>123 Business Ave, Suite 100</p>
                <p>City, State 12345</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Michele Aranha Personalizados. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;