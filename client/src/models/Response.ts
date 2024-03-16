export type Response<T> = {
    sendRequest: () => Promise<void>;
    status: number;
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    loading: boolean;
    error: any;
}