"use client"
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios, { AxiosResponse } from 'axios';

interface PostData {
    title: string;
    content: string;
    author: string;
    theme: string; // Add theme property
}

interface Props {
    params: {
        slug: string;
    };
}

export default function Page({ params }: Props) {
    const [postData, setPostData] = useState<PostData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<PostData> = await axios.get<PostData>('https://5000-kunhnao-mditor-w50rz90hi9d.ws-eu108.gitpod.io/api/' + params.slug, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setPostData(response.data);
                applyTheme(response.data.theme); // Apply the theme
            } catch (error) {
                console.error('Error:', error);
                setError('Uh, something went wrong. ');
            }
        };

        fetchData();

    }, [params.slug]);

    const applyTheme = (theme: string) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `/themes/${theme}.css`; // Assuming the themes are stored in the "public" directory
        document.head.appendChild(link);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!postData) {
        return <div>Loading...</div>;
    }

    const { title, content, author } = postData;

    return (
        <main>
            <ReactMarkdown className="md mb-24">{content}</ReactMarkdown>
            <span className="font-mono text-slate-500 text-sm">"{title}"<br/>Created by {author} on <a href="https://mditor.vercel.app" className="font-mono underline">mditor.vercel.app</a></span>
        </main>
    );
}
