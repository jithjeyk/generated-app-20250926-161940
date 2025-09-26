import React, { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
export function UnlockModal() {
  const [password, setPassword] = useState('');
  const { username, setEncryptionKey } = useAuthStore();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setEncryptionKey(password);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-diary-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-diary-accent text-white rounded-full p-4">
              <KeyRound className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-diary-text">Session Locked</CardTitle>
          <CardDescription className="text-lg text-slate-600 pt-2">
            Welcome back, {username}! Please re-enter your master password to unlock your diary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-md font-medium text-diary-text">Master Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your master password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="text-lg p-4"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-diary-accent hover:bg-sky-600 text-white text-lg font-semibold py-6 transition-all duration-200 ease-in-out hover:shadow-lg active:scale-95"
            >
              <Lock className="mr-2 h-5 w-5" />
              Unlock
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-slate-500 text-center w-full">
            Your password is used to decrypt your entries and is never stored.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}