'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, adminSetup } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  
  // Setup fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSetupMode) {
        if (!username || !email || !password) {
          toast.error('Username, email, and password are required for setup.');
          setLoading(false);
          return;
        }
        const res = await adminSetup({ username, email, password, name });
        if (res.data?.success) {
          localStorage.setItem('adminToken', res.data.token);
          toast.success('Admin setup complete & logged in!');
          router.push('/admin/dashboard');
        }
      } else {
        if (!username || !password) {
          toast.error('Username and password are required.');
          setLoading(false);
          return;
        }
        const res = await adminLogin({ username, password });
        if (res.data?.success) {
          localStorage.setItem('adminToken', res.data.token);
          toast.success('Successfully logged in!');
          router.push('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Authentication failed. Please check credentials.';
      toast.error(msg);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-dark/50 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-heading font-bold text-xl">Z</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
            {isSetupMode ? 'Create Admin Account' : 'Admin Control Panel'}
          </h1>
          <p className="text-silver text-xs uppercase tracking-widest mt-1">
            Zeeshan Aluminum Interior
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-charcoal/80 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm transition-colors"
              placeholder="admin"
            />
          </div>

          {isSetupMode && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-charcoal/80 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm transition-colors"
                  placeholder="admin@zeeshan.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-charcoal/80 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm transition-colors"
                  placeholder="Zeeshan"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-charcoal/80 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-white font-semibold rounded-lg hover:from-gold-dark hover:to-gold transition-colors text-sm uppercase tracking-wider shadow-lg shadow-gold/20"
          >
            {loading ? 'Authenticating...' : isSetupMode ? 'Register Admin' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button
            type="button"
            onClick={() => setIsSetupMode(!isSetupMode)}
            className="text-xs text-gold/80 hover:text-gold transition-colors"
          >
            {isSetupMode ? 'Back to Login' : 'Setup Initial Admin Account'}
          </button>
        </div>
      </div>
    </main>
  );
}
