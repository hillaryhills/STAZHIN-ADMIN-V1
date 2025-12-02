import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMessageByID } from "../../redux/messageCenter";
import Loader from "../ui/loader/Loader";
import Badge from "../ui/badge/Badge";
import { RootState, AppDispatch } from "../../redux/store";
import { BadgeColorType } from "../../redux/app/interface";

export default function SingleMessage() {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();

    const { singleMessage, loading } = useSelector(
        (state: RootState) => state.messageCenter
    );

    useEffect(() => {
        if (id) dispatch(getMessageByID(id));
    }, [id, dispatch]);

    if (loading || !singleMessage) {
        return (
            <div className="w-full flex justify-center items-center h-screen">
                <Loader size={60} />
            </div>
        );
    }

    const {
        title,
        body,
        type,
        channels,
        ownerId,
        overallStatus,
        createdAt,
        attempts,
        priority,
        idempotencyKey,
        correlationId,
    } = singleMessage;

    const showRetrigger = ["partial", "failed"].includes(overallStatus);

    const handleRetrigger = () => {
        console.log("Retrigger action for message:", id);
    };

    return (
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            {/* Title */}
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">{title}</h1>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="space-y-1">
                    <div>Type: <Badge color="primary">{type}</Badge></div>
                    <div>Status: <Badge color={statusColorMap[overallStatus] || "dark"}>{overallStatus}</Badge></div>
                    <div>Sent to: {ownerId?.name || ownerId?.business_name} ({ownerId?.email})</div>
                    <div>Channels: {channels?.join(", ")}</div>
                    <div>Created: {new Date(createdAt).toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                    <div>Priority: <span className="font-medium">{priority}</span></div>
                    <div>Idempotency Key: <span className="font-mono">{idempotencyKey}</span></div>
                    <div>Correlation ID: <span className="font-mono">{correlationId}</span></div>
                    {showRetrigger && (
                        <button
                            onClick={handleRetrigger}
                            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Re-trigger
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="text-gray-700 dark:text-gray-200 whitespace-pre-line mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {body}
            </div>

            {/* Attempts */}
            {attempts && attempts.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-2">Delivery Attempts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {attempts.map((a, idx) => (
                            <div
                                key={idx}
                                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Channel: {a.channel}</span>
                                    <span className="flex items-center gap-1">
                                        Status: <Badge size="sm" color={statusColorMap[a.status] || "dark"}>{a.status}</Badge>
                                    </span>
                                </div>
                                {a.error && <div className="text-sm text-red-500 mb-1">Error: {a.error}</div>}
                                <div className="text-xs text-gray-400">
                                    Started: {new Date(a.startedAt).toLocaleString()} <br />
                                    Finished: {a.finishedAt ? new Date(a.finishedAt).toLocaleString() : "—"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const statusColorMap: Record<string, BadgeColorType> = {
    queued: "light",
    processing: "warning",
    partial: "warning",
    completed: "success",
    failed: "error",
    pending: "warning",
    sent: "info",
    delivered: "success",
    unknown: "dark",
};
