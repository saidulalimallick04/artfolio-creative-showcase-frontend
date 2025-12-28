'use client';

import { useState, useEffect } from 'react';
import {
    Share2,
    Copy,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
    artworkId: string;
    title: string;
}

const SocialIcons = {
    Twitter: (props: any) => (
        <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    Facebook: (props: any) => (
        <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.66-2.797 3.54v.437h4.94l-.71 3.664h-4.23v7.98h-4.997z" />
        </svg>
    ),
    LinkedIn: (props: any) => (
        <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    WhatsApp: (props: any) => (
        <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
};

export function ShareButton({ artworkId, title }: ShareButtonProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    // Construct URL on client side to ensure correct origin
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(`${window.location.origin}/art/${artworkId}`);
        }
    }, [artworkId]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast({
                title: "Link Copied!",
                description: "Share link copied to clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Failed to copy",
                description: "Please copy the link manually.",
            });
        }
    };

    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            // Auto-copy when opening
            handleCopy();
        }
    };

    const socialLinks = [
        {
            name: 'Twitter',
            icon: SocialIcons.Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
            color: 'hover:text-[#000000] dark:hover:text-[#FFFFFF]' // X branding: black on light, white on dark
        },
        {
            name: 'Facebook',
            icon: SocialIcons.Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: 'hover:text-[#1877F2]'
        },
        {
            name: 'LinkedIn',
            icon: SocialIcons.LinkedIn,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:text-[#0A66C2]'
        },
        {
            name: 'WhatsApp',
            icon: SocialIcons.WhatsApp,
            url: `https://wa.me/?text=${encodeURIComponent(title + " " + shareUrl)}`,
            color: 'hover:text-[#25D366]'
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 rounded-full group transition-all duration-300 active:scale-95" size="lg">
                    <Share2 className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Artwork</DialogTitle>
                    <DialogDescription>
                        Share this creative piece with your friends and community.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center space-x-2 pt-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={shareUrl}
                            readOnly
                            className="bg-muted/50"
                        />
                    </div>
                    <Button type="button" size="icon" variant="secondary" onClick={handleCopy} className="shrink-0">
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>

                <div className="flex justify-center gap-6 pt-6 pb-2">
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-muted-foreground transition-all transform hover:scale-110 p-2 rounded-full hover:bg-muted ${social.color}`}
                            title={`Share on ${social.name}`}
                        >
                            <social.icon className="h-6 w-6" />
                            <span className="sr-only">{social.name}</span>
                        </a>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
