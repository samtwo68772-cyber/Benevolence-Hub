
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { DollarSign, Gift, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const donationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  amount: z.string().min(1, "Please select or enter an amount."),
  customAmount: z.string().optional(),
  isRecurring: z.boolean().default(false),
}).refine(data => {
    if (data.amount === 'custom') {
        return data.customAmount && !isNaN(parseFloat(data.customAmount)) && parseFloat(data.customAmount) > 0;
    }
    return true;
}, {
  message: "Please enter a valid custom amount.",
  path: ["customAmount"],
});

const presetAmounts = ["25", "50", "100", "250"];

export function DonationDialog() {
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "50",
      customAmount: "",
      isRecurring: false,
    },
  })

  function onSubmit(values: z.infer<typeof donationSchema>) {
    const finalAmount = values.amount === 'custom' ? values.customAmount : values.amount;
    toast({
      title: "Thank you for your generosity!",
      description: `Thank you, ${values.name}. Your ${values.isRecurring ? 'recurring' : 'one-time'} donation of $${finalAmount} has been processed. A confirmation has been sent to ${values.email}.`,
    })
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 group transition-transform duration-300 ease-in-out hover:scale-105 lg:w-auto">
          <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
          Donate Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex justify-center items-center bg-primary/10 w-16 h-16 rounded-full mx-auto mb-4">
             <Gift className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center font-headline text-3xl">Make a Difference</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Your contribution helps us continue our vital work.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input type="email" placeholder="jane.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">Select an amount (USD)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== 'custom') {
                            form.setValue('customAmount', '');
                        }
                      }}
                      defaultValue={field.value}
                      className="grid grid-cols-2 sm:grid-cols-2 gap-4"
                    >
                      {presetAmounts.map((amount) => (
                        <FormItem key={amount}>
                          <FormControl>
                            <RadioGroupItem value={amount} id={`amount-${amount}`} className="sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor={`amount-${amount}`}
                            className={cn(
                              "flex h-16 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover text-lg font-semibold hover:bg-accent/10 hover:text-accent-foreground",
                              field.value === amount && "border-primary bg-primary/10"
                            )}
                          >
                            ${amount}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customAmount"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="number" 
                      placeholder="Or enter a custom amount" 
                      {...field} 
                      className="pl-10" 
                      onFocus={() => form.setValue('amount', 'custom')}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Make it a monthly donation</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Recurring gifts provide sustainable support.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full text-lg h-12 bg-accent text-accent-foreground hover:bg-accent/90">
              Donate
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
