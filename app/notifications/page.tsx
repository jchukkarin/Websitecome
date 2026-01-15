'use client';

import { useState } from 'react';
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export default function NotificationsPage() {
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const sendNotification = async () => {
        setStatus('Sending...');
        try {
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    title,
                    message,
                }),
            });
            if (res.ok) {
                setStatus('Sent! 🎉');
            } else {
                const data = await res.json();
                setStatus('Error: ' + (data.error || 'Unknown error'));
            }
        } catch (e: any) {
            setStatus('Error: ' + e.message);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-bold">🔔 Send Notification</h1>
            <p className="text-gray-500 text-sm">Test the notification system by sending an email.</p>

            <Input
                label="User ID"
                placeholder="Enter target user UUID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <Input
                label="Title"
                placeholder="Notification Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Input
                label="Message"
                placeholder="Notification Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <Button color="primary" onPress={sendNotification}>
                Send Notification
            </Button>

            {status && (
                <div className={`p-2 rounded mt-2 ${status.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {status}
                </div>
            )}
        </div>
    );
}