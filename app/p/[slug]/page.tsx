"use client"
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios, { AxiosResponse } from 'axios';
import { FaSpinner, FaX } from "react-icons/fa6";

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
                const response: AxiosResponse<PostData> = await axios.get<PostData>('https://mditorapi.onrender.com/api/' + params.slug, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setPostData(response.data);
                applyTheme(response.data.theme); // Apply the theme
            } catch (error) {
                console.error('Error:', error);
                setError(error as string);
            }
        };

        fetchData();

    }, [params.slug]);

    const applyTheme = (theme: string) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `/themes/${theme}.css`;
        document.head.appendChild(link);
    };

    if (error) {
        return (
            <>
            <section className="w-full h-screen flex flex-col items-center justify-center text-center p-16">
                <FaX className="text-sm text-slate-500 mb-8"/>
                <p className="text-slate-500 text-sm mb-8">Whoops, something went wrong. Either this page doesn't exist, or something went badly wrong on our side.<br/><br/>Either way, it's not your fault.</p>
            </section>
            </>
        );
    }

    if (!postData) {
        return (
            <>
            <section className="w-full h-screen flex flex-col items-center justify-center text-center p-24">
                <FaSpinner className="text-sm text-slate-500 animate-spin mb-8"/>
                <p className="text-slate-500 text-sm">Create your own page like this one for free on<br/><a href="https://mditor.vercel.app">https://mditor.vercel.app</a></p>
            </section>
            </>
        );
    }

    const { title, content, author } = postData;

    document.title = title

    return (
        <main>
            <ReactMarkdown className="md mb-24">{content}</ReactMarkdown>
            <span className="font-mono text-slate-500 text-sm">"{title}"<br/>Created by {author} on <a href="https://mditor.vercel.app" className="font-mono underline">mditor.vercel.app</a></span>
        </main>
    );
}
