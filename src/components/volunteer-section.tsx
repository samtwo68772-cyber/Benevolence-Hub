"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { HeartHandshake } from "lucide-react"

const volunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().optional(),
})

export default function VolunteerSection() {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof volunteerSchema>>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })

    function onSubmit(values: z.infer<typeof volunteerSchema>) {
        toast({
            title: "Registration Received!",
            description: `Thank you for your interest, ${values.name}. We'll be in touch soon!`,
        })
        form.reset()
    }

  return (
    <section id="volunteer" className="section-padding">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <HeartHandshake className="h-16 w-16 text-primary" />
            <h2 className="font-headline text-4xl md:text-5xl">Become a Volunteer</h2>
            <p className="text-lg text-muted-foreground">
              Your time and skills are invaluable. Join our team of dedicated volunteers and make a direct impact on the ground. Together, we can build stronger communities.
            </p>
             <p className="text-lg text-muted-foreground">
              Whether you have experience in healthcare, education, construction, or administration, there's a place for you at Benevolence Hub. Fill out the form to get started.
            </p>
          </div>
          <div className="rounded-lg bg-card p-8 shadow-xl">
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="font-headline text-2xl mb-6 text-center">Join Our Team</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skills or Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us how you'd like to help..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Sign Up to Volunteer
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
