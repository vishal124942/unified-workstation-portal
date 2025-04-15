
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const SOFTWARE_LIST = [
  { name: "VS CODE", description: "Code editing. Redefined." },
  { name: "JUPYTER NOTEBOOK", description: "Interactive computing notebook" },
  { name: "POSTMAN", description: "API platform for building and using APIs" },
  { name: "MLFLOW", description: "An open source platform for the machine learning lifecycle" },
  { name: "KUBEFLOW", description: "The Machine Learning Toolkit for Kubernetes" },
  { name: "AIRFLOW", description: "Platform to programmatically author, schedule, and monitor workflows" },
  { name: "PINECONE", description: "Vector database for machine learning applications" },
  { name: "PROMETHESUS", description: "Monitoring system & time series database" },
  { name: "GRAFANA", description: "Analytics & monitoring solution" },
  { name: "DEVOPS", description: "Development operations tools" },
  { name: "AUTOML", description: "Automated machine learning" },
  { name: "LLMOPS", description: "Large language model operations" },
  { name: "GITHUB", description: "Development platform inspired by the way you work" }
];

const FAQ_ITEMS = [
  { 
    question: "What is the Unified Workstation Portal?", 
    answer: "The Unified Workstation Portal is a centralized platform that provides single sign-on access to various development, data science, and DevOps tools. It simplifies tool access and management for both users and administrators." 
  },
  { 
    question: "How does Single Sign-On (SSO) work?", 
    answer: "Once logged into the portal, you can access any of your authorized applications without having to log in again. The system securely passes your credentials to the target application." 
  },
  { 
    question: "How do I request access to specific tools?", 
    answer: "Your administrator manages access to tools. Contact your administrator through the portal to request access to specific tools for your projects." 
  },
  { 
    question: "Can I save my work within the portal?", 
    answer: "Yes, you can save your work within applications and submit it to administrators for review directly through the portal interface." 
  },
  { 
    question: "How do I change my password or update my profile?", 
    answer: "You can update your profile information and change your password through the user dashboard under profile settings." 
  }
];

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Unified Workstation Portal</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#software" className="text-white hover:text-blue-200 transition">Software</a></li>
              <li><a href="#about" className="text-white hover:text-blue-200 transition">About</a></li>
              <li><a href="#services" className="text-white hover:text-blue-200 transition">Services</a></li>
              <li><a href="#faq" className="text-white hover:text-blue-200 transition">FAQ</a></li>
              <li>
                <Link to="/login">
                  <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">Login</Button>
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Unified Access to Your Development Toolkit</h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            One portal, multiple tools. Access all your development, data science, and DevOps applications with a single sign-on.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Software Section */}
      <section id="software" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Integrated Software Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOFTWARE_LIST.map((software) => (
              <Card key={software.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{software.name}</h3>
                  <p className="text-gray-600">{software.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h2 className="text-3xl font-bold mb-6">About Our Platform</h2>
              <p className="text-gray-600 mb-4">
                The Unified Workstation Portal is designed to streamline access to essential development and data science tools for modern IT professionals. 
              </p>
              <p className="text-gray-600 mb-4">
                Our platform simplifies the workflow by providing a single point of entry to all your tools, with seamless authentication and access management.
              </p>
              <p className="text-gray-600">
                Administrators can easily manage user access, monitor activity, and ensure proper resource allocation across teams and projects.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="mb-4">
                  To provide a seamless, secure, and efficient platform that unifies access to development tools and enhances productivity for IT professionals.
                </p>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p>
                  A world where technology teams can focus on innovation and problem-solving rather than managing tool access and authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Single Sign-On (SSO)</h3>
              <p className="text-gray-600">
                Access all your development and data science tools with a single authentication, eliminating the need for multiple logins.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Work Management</h3>
              <p className="text-gray-600">
                Save, organize, and submit your work from any application through our unified interface for review and collaboration.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Controls</h3>
              <p className="text-gray-600">
                Comprehensive admin panel for managing user access, monitoring activities, and connecting to databases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Unified Workstation Portal</h3>
              <p className="text-gray-400">
                Your centralized access point for all development and data science tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#software" className="text-gray-400 hover:text-white transition">Software</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition">Services</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Unified Workstation Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
