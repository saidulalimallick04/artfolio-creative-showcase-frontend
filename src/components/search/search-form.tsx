'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [type, setType] = useState(searchParams.get('type') || 'artworks');

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
        setType(searchParams.get('type') || 'artworks');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
    };

    const handleReset = () => {
        setQuery('');
        router.push(`/search?type=${type}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-3xl mx-auto">
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full sm:w-[180px] h-12">
                    <SelectValue placeholder="Search type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="artworks">Artworks</SelectItem>
                    <SelectItem value="users">Artists & Users</SelectItem>
                </SelectContent>
            </Select>

            <div className="relative flex-1 w-full">
                <Input
                    type="text"
                    placeholder={type === 'artworks' ? "Search for artworks..." : "Search for users..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-12 w-full pl-4 pr-10"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <Button type="submit" size="lg" className="h-12 px-8 w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Search
            </Button>
        </form>
    );
}
