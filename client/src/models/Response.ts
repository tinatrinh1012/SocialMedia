export type Response<T> = {
    status: number;
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    loading: boolean;
    error: any;
}