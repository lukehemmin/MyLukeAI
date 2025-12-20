
import { Metadata } from "next"
import AdminLogsClient from "@/components/admin/AdminLogsClient"

export const metadata: Metadata = {
    title: "Chat Logs | Admin",
    description: "View chat logs",
}

export default function AdminLogsPage() {
    return <AdminLogsClient />
}
