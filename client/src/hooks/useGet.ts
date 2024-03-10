import { useEffect, useState } from "react";
import { Response } from "../models/Response";

export function useGet<T>(url: string): Response<T> {
    const [status, setStatus] = useState<number>(0);
    const [data, setData] = useState<T>(0 as unknown as T);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();

    async function get() {
        console.log('get', url);
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}${url}`, {credentials: 'include'});
            const json = await response.json();
            setStatus(response.status);
            setData(json);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        get();
    }, [])

    return { status, data, setData, loading, error }
}