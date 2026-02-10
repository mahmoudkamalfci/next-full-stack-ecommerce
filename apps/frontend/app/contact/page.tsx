"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Here you would typically send the data to your backend
        alert("Message sent! (Demo only)");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Have questions about our products or need assistance? We&apos;re here to help.
                    Fill out the form below or reach out to us directly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Information */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg mb-1">Our Location</h3>
                            <p className="text-gray-600">
                                123 Fashion Street<br />
                                New York, NY 10001<br />
                                United States
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg mb-1">Phone Number</h3>
                            <p className="text-gray-600">
                                +1 (555) 123-4567<br />
                                Mon - Fri, 9am - 6pm EST
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg mb-1">Email Address</h3>
                            <p className="text-gray-600">
                                support@freshfit.com<br />
                                sales@freshfit.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                                Subject
                            </label>
                            <Input
                                id="subject"
                                name="subject"
                                placeholder="How can we help?"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                Message
                            </label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Write your message here..."
                                className="min-h-[150px]"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
