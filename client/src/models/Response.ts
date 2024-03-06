export type Response<T> = {
    status: number;
    data: T;
    loading: boolean;
    error: any;
}