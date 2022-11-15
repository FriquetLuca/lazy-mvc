import { LazyClient } from "@lazy-toolbox/client";

export const connectSocket = (): LazyClient => {
    return new LazyClient(<string>process.env.HOST, Number(process.env.SOCKET_PORT))
};