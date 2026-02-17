import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verifyUrl?: string;
  skills: string[];
  seal: string;
}

const certificates: Certificate[] = [
  {
    id: 'aws-saa',
    title: 'AWS Solutions Architect Associate',
    issuer: 'Amazon Web Services',
    date: '2024',
    credentialId: 'AWS-ASA-123456',
    verifyUrl: 'https://aws.amazon.com/certification',
    skills: ['Cloud Architecture', 'EC2', 'S3', 'VPC', 'RDS'],
    seal: '☁️',
  },
  {
    id: 'cka',
    title: 'Certified Kubernetes Administrator',
    issuer: 'Cloud Native Computing Foundation',
    date: '2023',
    credentialId: 'CKA-789012',
    verifyUrl: 'https://www.cncf.io/certification',
    skills: ['Kubernetes', 'Docker', 'Container Orchestration'],
    seal: '☸️',
  },
  {
    id: 'oracle-java',
    title: 'Oracle Certified Professional: Java SE 17 Developer',
    issuer: 'Oracle',
    date: '2023',
    credentialId: 'OCP-345678',
    skills: ['Java', 'OOP', 'Concurrency', 'JVM'],
    seal: '☕',
  },
  {
    id: 'spring-pro',
    title: 'Spring Certified Professional',
    issuer: 'VMware',
    date: '2024',
    skills: ['Spring Boot', 'Spring Security', 'Microservices'],
    seal: '🌿',
  },
];

export const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section id="credentials" className="relative min-h-screen py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-[var(--gold)] uppercase tracking-[0.3em]">
              Verified Credentials
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 text-glow">
            The Sealed Credentials
          </h2>
          <p className="font-serif italic text-white/60 max-w-xl mx-auto">
            "Authority granted by trial and examination. Each seal represents 
            a covenant of knowledge with the great institutions."
          </p>
        </motion.div>

        {/* Wax Seal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer"
            >
              <div className="relative p-8 backdrop-blur-md bg-black/20 border border-[var(--gold)]/20 hover:border-[var(--gold)]/50 transition-all duration-500">
                {/* Wax seal decoration */}
                <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(197,160,89,0.4)] group-hover:scale-110 transition-transform">
                  {cert.seal}
                </div>

                {/* Ribbon effect */}
                <div className="absolute top-0 left-8 w-2 h-full bg-gradient-to-b from-[var(--gold)]/40 via-[var(--gold)]/20 to-transparent" />

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30">
                    <Award className="w-6 h-6 text-[var(--gold)]" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-white group-hover:text-[var(--gold)] transition-colors mb-1">
                      {cert.title}
                    </h3>
                    <p className="font-mono text-xs text-white/50 uppercase tracking-wider mb-3">
                      {cert.issuer} • {cert.date}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/60 bg-white/5 border border-white/10 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover reveal */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-[10px] text-[var(--gold)] flex items-center gap-1">
                    Inspect Seal <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-lg w-full p-8 bg-[var(--ink)] border-2 border-[var(--gold)]/30 rounded-lg"
              >
                {/* Large seal */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gold)] to-[#8b6239] flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(197,160,89,0.5)]">
                  {selectedCert.seal}
                </div>

                <div className="mt-8 text-center">
                  <h3 className="font-serif text-2xl text-white mb-2">
                    {selectedCert.title}
                  </h3>
                  <p className="font-mono text-sm text-[var(--gold)] mb-6">
                    {selectedCert.issuer}
                  </p>

                  <div className="space-y-3 text-left mb-6">
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="font-mono text-xs text-white/50 uppercase">Date of Issue</span>
                      <span className="font-serif text-white">{selectedCert.date}</span>
                    </div>
                    {selectedCert.credentialId && (
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="font-mono text-xs text-white/50 uppercase">Credential ID</span>
                        <span className="font-mono text-xs text-[var(--gold)]">{selectedCert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {selectedCert.verifyUrl && (
                      <a
                        href={selectedCert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-[var(--gold)]/20 border border-[var(--gold)]/50 text-[var(--gold)] font-mono text-xs uppercase tracking-wider rounded hover:bg-[var(--gold)]/30 transition-colors text-center"
                      >
                        Verify Authenticity
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="px-6 py-3 border border-white/20 text-white/60 hover:text-white font-mono text-xs uppercase rounded hover:border-white/40 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};