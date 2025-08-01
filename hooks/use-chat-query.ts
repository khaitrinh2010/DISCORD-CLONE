import qs from "query-string";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket} from "@/components/providers/socker-provider";
import {disconnect} from "effect/Effect";

interface ChatQueryProps {
    queryKey: string,
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue } : ChatQueryProps) => {
    const { isConnected } = useSocket()
    const fetchMessages = async ({ pageParam = 0 }) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                [paramKey]: paramValue,
                cursor: pageParam,
            }
        }, {skipNull: true});
        const res = await fetch(url)
        return res.json()
    }

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor || undefined,
        refetchInterval : isConnected ? 1000 : false,
    })

    return {data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
}

