
import { Suspense } from 'react';
import { SearchForm } from '@/components/search/search-form';
import { SearchResults } from '@/components/search/search-results';
import { getArtworks } from '@/actions/artworks_action';
import { getUsers } from '@/actions/users_action';
import { Loader2 } from 'lucide-react';

import { Artwork, UserPublic } from '@/types/api';

interface SearchPageProps {
    searchParams: {
        q?: string;
        type?: string;
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || '';
    const type = searchParams.type || 'artworks';

    let data: Artwork[] | UserPublic[] = [];
    if (query) {
        if (type === 'artworks') {
            const result = await getArtworks(query);
            data = result.success && result.data ? result.data : [];
        } else {
            const result = await getUsers(query);
            data = result.success && result.data ? result.data : [];
        }
    }

    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            <header className="mb-12 text-center">
                <h1 className="font-headline text-3xl md:text-5xl font-bold mb-6">Search ArtFolio</h1>
                <Suspense>
                    <SearchForm />
                </Suspense>
            </header>

            <main>
                {query ? (
                    <SearchResults type={type} data={data} />
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-xl">Enter a keyword to start searching.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
