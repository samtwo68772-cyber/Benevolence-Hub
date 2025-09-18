
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
import { volunteers } from "@/lib/data"
import { format } from "date-fns"


const volunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Please tell us a bit more about your skills and why you'd like to volunteer."),
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
        // In a real app, this would send data to a server.
        // For this demo, we'll just add it to the mock data array.
        const newVolunteer = {
            id: `VOL-${Date.now()}`,
            name: values.name,
            email: values.email,
            signupDate: format(new Date(), 'yyyy-MM-dd'),
            skills: values.message,
            status: 'Pending' as const
        };
        volunteers.unshift(newVolunteer); // Add to the beginning of the array

        toast({
            title: "Registration Received!",
            description: `Thank you for your interest, ${values.name}. We've received your application and will be in touch soon!`,
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
                      <FormLabel>Skills & Why You'd Like to Help</FormLabel>
                      <FormControl>
                        <Textarea placeholder="E.g., I'm a registered nurse and would love to help with medical aid projects..." className="resize-none" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Submit Application
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
