
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { authenticate } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { Settings } from "@/lib/types";
import * as LucideIcons from 'lucide-react';
import Image from "next/image";

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" aria-disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    )
}

function Logo({ settings }: { settings: Settings }) {
    if (settings.logoType === 'image' && settings.logo) {
      return <Image src={settings.logo} alt={settings.appName} width={48} height={48} className="h-12 w-12" />;
    }
  
    const LogoIcon = LucideIcons[settings.logo as keyof typeof LucideIcons] || LucideIcons.HandHeart;
    return <LogoIcon className="h-12 w-12 text-primary" />;
}


export function LoginForm({ settings }: { settings: Settings }) {
    const { toast } = useToast();
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    React.useEffect(() => {
        if (errorMessage) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: errorMessage
            })
        }
    }, [errorMessage, toast])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Logo settings={settings} />
            </div>
          <CardTitle className="font-headline text-3xl">{settings.appName} Admin</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={dispatch}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <LoginButton />
            <div className="text-center text-sm text-muted-foreground">
                <Link href="/" className="underline hover:text-primary">
                    Back to Main Site
                </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
