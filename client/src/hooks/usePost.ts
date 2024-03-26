import { useCallback, useState } from "react";
import { Response } from "../models/Response";

export function usePost<T>(url: string, body: any = undefined): Response<T> {
    const [status, setStatus] = useState<number>(0);
    const [data, setData] = useState<T>(undefined as unknown as T);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();

    const post = useCallback(async () => {
        console.log('post', url);
        setStatus(0);
        setData(undefined as unknown as T);
        setLoading(true);
        setError(undefined);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}${url}`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const json = await response.json();
            setStatus(response.status);
            setData(json);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    }, [body, url])

    return { sendRequest: post, status, data, setData, loading, error }
}