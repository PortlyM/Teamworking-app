'use client'

import { useRouter } from "next/navigation";

interface ButtonProps {
    text: string;
    path: string;
}

export default function Button({text, path}: ButtonProps) {
    const router = useRouter();
    
    const handlePath = async () => {
        router.push(path)
    }
    
    return (
        <button onClick={handlePath}>{text}</button>
    )
}