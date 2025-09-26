import React, { useState } from 'react';
import { Lock, BookLock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { Toaster } from '@/components/ui/sonner';
export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login(username, password);
    }
  };
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-diary-background p-4">
      <Toaster richColors closeButton />
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-diary-accent text-white rounded-full p-4">
                <BookLock className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-diary-text">Cryptext Diary</CardTitle>
            <CardDescription className="text-lg text-slate-600 pt-2">
              Your private, encrypted journal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-md font-medium text-diary-text">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="text-lg p-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-md font-medium text-diary-text">Master Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your master password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-lg p-4"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-diary-accent hover:bg-sky-600 text-white text-lg font-semibold py-6 transition-all duration-200 ease-in-out hover:shadow-lg active:scale-95"
              >
                <Lock className="mr-2 h-5 w-5" />
                Unlock Diary
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-500 text-center px-4">
              <strong>Warning:</strong> If you forget your master password, your data will be unrecoverable.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}