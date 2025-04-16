
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { availableSoftware } from '../data/software';

const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-12"
      >
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 text-transparent bg-clip-text">
              Your Software Hub
            </h1>
          </div>
        </motion.div>

        {availableSoftware.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-8 text-center"
          >
            <p className="text-white/80">
              You don't have access to any software yet. Please contact your administrator.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSoftware.map((software) => (
              <motion.div
                key={software.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      {React.createElement(software.icon as any, {
                        className: "w-7 h-7 text-purple-400 mr-3"
                      })}
                      <h2 className="text-xl font-semibold text-white">{software.name}</h2>
                    </div>
                    <p className="text-white/70 mb-6">{software.description}</p>
                    <a
                      href={software.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium 
                        bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
                        text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 
                        transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Launch Software
                      <ExternalLink className="ml-2 -mr-1 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
