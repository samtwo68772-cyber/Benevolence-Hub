
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { HeartHandshake, XCircle } from "lucide-react"
import { volunteers } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "./ui/badge"


const availabilityItems = [
    { id: "weekdays", label: "Weekdays" },
    { id: "weekends", label: "Weekends" },
    { id: "evenings", label: "Evenings" },
]

const interestItems = ["Education", "Medical", "Community Development", "Disaster Relief", "General Support"]

const volunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  availability: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one availability option.",
  }),
  interests: z.array(z.string()).refine(value => value.length > 0, {
      message: "Please select at least one area of interest."
  }),
  message: z.string().min(10, "Please tell us a bit more about your skills and why you'd like to volunteer."),
})

type VolunteerFormValues = z.infer<typeof volunteerSchema>

export default function VolunteerSection() {
    const { toast } = useToast()

    const form = useForm<VolunteerFormValues>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            availability: [],
            interests: [],
            message: "",
        },
    })

    function onSubmit(values: VolunteerFormValues) {
        const newVolunteer = {
            id: `VOL-${Date.now()}`,
            name: values.name,
            email: values.email,
            phone: values.phone,
            signupDate: format(new Date(), 'yyyy-MM-dd'),
            skills: values.message,
            availability: values.availability,
            interests: values.interests,
            status: 'Pending' as const
        };
        volunteers.unshift(newVolunteer);

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="availability"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Availability</FormLabel>
                        <FormDescription>
                          Let us know when you are typically available to volunteer.
                        </FormDescription>
                      </div>
                      <div className="flex flex-wrap gap-4">
                      {availabilityItems.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="availability"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Areas of Interest</FormLabel>
                         <Select onValueChange={(value) => field.onChange(field.value.includes(value) ? field.value : [...field.value, value])} >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select areas you're interested in" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {interestItems.map(item => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {field.value.map(interest => (
                                <Badge key={interest} variant="secondary" className="capitalize">
                                    {interest}
                                    <button
                                        type="button"
                                        className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onClick={() => field.onChange(field.value.filter(v => v !== interest))}
                                    >
                                        <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
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
