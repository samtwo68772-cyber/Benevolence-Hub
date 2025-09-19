
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HandHeart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { authenticate } from "../_actions/auth";
import { useToast } from "@/hooks/use-toast";
import React from "react";

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" aria-disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    )
}

export default function AdminLoginPage() {
    const router = useRouter();
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
                <HandHeart className="w-12 h-12 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl">Admin Login</CardTitle>
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
