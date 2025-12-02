import { JSX } from "react"
import { Column, BadgeColorType } from "../app/interface"
import Badge from "../../components/ui/badge/Badge"
import Checkbox from "../../components/form/input/Checkbox"
import { MoreDotIcon } from "../../icons"


export interface IMessageCenterState {
    loading: boolean
    error: null | unknown
    success: boolean
    messages: IMessage[] | null
    pagination: any | null
    singleMessage: IMessage | null
}



export interface IMessage {
    _id: string
    ownerId: {
        _id: string
        name: string
        email: string
        business_name: string
    }
    to: {
        userId: string
        deviceTokens: string[]
        socketChannel: string
        email: string
        phone: string
    }
    type: string
    templateId: string
    title: string
    body: string
    data: { [key: string]: string | undefined }
    channels: string[] // enum: ['pusher', 'fcm', 'twilio']
    attempts: IAttemptSchema[],
    overallStatus: string //enum: ['queued', 'processing', 'partial', 'completed', 'failed']
    scheduledAt: string
    priority: number
    idempotencyKey: string
    correlationId: string
    createdAt: string
    updatedAt: string
}

export interface IAttemptSchema {
    channel: string
    providerResponse: string
    status: string
    error: string
    startedAt: string
    finishedAt: string
}

export interface IMessageData {
    data: IMessage[]
}


export const columns: Column[] = [
    { key: "select", label: "" },
    { key: "ownerId", label: "User" },
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "overallStatus", label: "Status" },
    { key: "channels", label: "Channels" },
    { key: "createdAt", label: "Created At" },
    { key: "action", label: "" },

];

const statusColorMap: Record<string, BadgeColorType> = {
    queued: "warning",
    processing: "info",
    partial: "primary",
    completed: "success",
    failed: "error",
};


export const renderColumn = (
    item: IMessage,
    selected: string[],
    toggleSelect: (id: string) => void,
     navigate: (path: string) => void
): Record<string, JSX.Element> => {
    return {
        select: (
            <Checkbox
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
            />
        ),
        ownerId: (
            <span className="text-black dark:text-brand-25">
                {item.ownerId.name || item.ownerId.business_name} <br />
                {item.ownerId.email}
            </span>
        ),

        title: (
            <span className="text-black dark:text-brand-25">
                {item.title}
            </span>
        ),

        type: <Badge color="primary">{item.type}</Badge>,

        overallStatus: (
            <Badge color={statusColorMap[item.overallStatus] || "dark"}>
                {item.overallStatus}
            </Badge>
        ),

        channels: (
            <span className="text-black dark:text-brand-25">
                {Array.isArray(item.channels)
                    ? item.channels.join(", ")
                    : item.channels}
            </span>
        ),

        createdAt: (
            <span className="text-black dark:text-brand-25">
                {new Date(item.createdAt).toLocaleString()}
            </span>
        ),

        action: (
            <span className="text-black dark:text-brand-25">
                <MoreDotIcon
                    className="cursor-pointer"
                    onClick={() => navigate(`/message-center/${item._id}`)}
                />
            </span>
        ),

    };
};
