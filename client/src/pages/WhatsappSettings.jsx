/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Loader2,
    Smartphone,
    AlertTriangle,
    QrCode,
    RefreshCcw,
    PlugZap,
    LogOut,
    Wifi,
    WifiOff,
    Clock,
} from "lucide-react";
import config from "../features/config";
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from "../utils/toast";
import ConfirmationModal from "../components/ConfirmationModal";

const WhatsappConnect = () => {
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState("checking");
    const [notification, setNotification] = useState("");
    const [connectionState, setConnectionState] = useState(null);
    const [lastActivity, setLastActivity] = useState(null);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const showNotification = (msg, type = "info") => {
        setNotification({ msg, type });
        if (type === "error") {
            showErrorToast(msg);
        } else if (type === "success") {
            showSuccessToast(msg);
        } else if (type === "warning") {
            showWarningToast(msg);
        } else {
            showInfoToast(msg);
        }
        setTimeout(() => setNotification(""), 3000);
    };

    const fetchQr = async () => {
        try {
            const data = await config.getQrCode();
            console.log('QR data:', data);
            
            if (data?.ready) {
                setStatus("connected");
                setQrCode(null);
            } else if (data?.qr) {
                setStatus("waiting");
                setQrCode(data.qr);
            } else if (data?.initializing) {
                setStatus("initializing");
            } else if (data?.notStarted) {
                setStatus("notReady");
            }
        } catch (err) {
            console.error("QR Fetch Error:", err);
            setStatus("error");
        }
    };

    const fetchStatus = useCallback(async () => {
        try {
            const data = await config.checkWhatsappStatus();
            console.log('WhatsApp status:', data);
            
            if (data?.ready) {
                setStatus("connected");
                setQrCode(null);
                setConnectionState(data.state);
            } else if (data?.initializing) {
                setStatus("initializing");
                // Just fetch QR, don't re-initialize
                fetchQr();
            } else {
                // Not ready and not initializing - show connect button
                setStatus("notReady");
            }
        } catch (err) {
            console.error("Status Error:", err);
            setStatus("error");
        }
    }, []);

    const initializeWhatsapp = async () => {
        try {
            setStatus("initializing");
            showNotification("Initializing WhatsApp connection...");
            const res = await config.initWhatsapp();
            console.log('init Whatsapp:', res)
            setTimeout(fetchQr, 3000);
        } catch (err) {
            console.error("Init Error:", err);
            showNotification("Failed to initialize WhatsApp", "error");
            setStatus("error");
        }
    };

    const handleReconnect = async () => {
        // Don't allow reconnect if already connected
        if (status === "connected") {
            showNotification("Already connected! Use Logout if you want to disconnect first.", "warning");
            return;
        }
        
        try {
            setIsReconnecting(true);
            showNotification("Reconnecting WhatsApp...");
            const res = await config.reconnectWhatsapp();
            
            // Check if server refused because already connected
            if (res?.status === "already_connected") {
                showNotification(res?.message || "Already connected!", "info");
                setStatus("connected");
            } else {
                showNotification("Reconnection initiated", "success");
                setTimeout(fetchStatus, 3000);
            }
        } catch (err) {
            console.error("Reconnect Error:", err);
            showNotification("Failed to reconnect", "error");
        } finally {
            setIsReconnecting(false);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const res = await config.logoutWhatsapp();
            if (res?.success) {
                showNotification("Logged out successfully", "success");
                setStatus("notReady");
                setQrCode(null);
                setConnectionState(null);
            } else {
                showNotification(res?.error || "Logout failed", "error");
            }
        } catch (err) {
            console.error("Logout Error:", err);
            showNotification("Failed to logout", "error");
        } finally {
            setIsLoggingOut(false);
            setShowLogoutConfirm(false);
        }
    };

    const formatLastActivity = (date) => {
        if (!date) return "N/A";
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);

        if (diffSec < 60) return "Just now";
        if (diffMin < 60) return `${diffMin} min ago`;
        if (diffHour < 24) return `${diffHour} hour(s) ago`;
        return date.toLocaleString();
    };

    useEffect(() => {
        fetchStatus();
        // Poll less aggressively - every 15 seconds
        const interval = setInterval(fetchStatus, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-5 right-5 px-4 py-2 rounded-md text-sm shadow-lg z-50 ${notification.type === "error"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : notification.type === "warning"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        : "bg-green-100 text-green-700 border border-green-300"
                        }`}
                >
                    {notification.msg}
                </div>
            )}

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-6 flex flex-col items-center text-center"
            >
                <div className="flex items-center justify-center gap-2 mb-4">
                    <PlugZap className="text-green-600 w-6 h-6" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        WhatsApp Connection
                    </h2>
                </div>

                {/* Status Display */}
                {status === "checking" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-green-600 w-10 h-10 mb-3" />
                        <p className="text-gray-600">Checking connection status...</p>
                    </div>
                )}

                {status === "initializing" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-3" />
                        <p className="text-gray-600">Initializing WhatsApp Client...</p>
                        <p className="text-gray-400 text-xs mt-2">This may take a moment...</p>
                    </div>
                )}

                {status === "waiting" && !qrCode && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-3" />
                        <p className="text-gray-600">Generating QR Code...</p>
                    </div>
                )}

                {status === "waiting" && qrCode && (
                    <>
                        <p className="text-gray-600 text-sm mb-2">
                            Scan this QR with your WhatsApp to connect
                        </p>
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={qrCode}
                            alt="WhatsApp QR"
                            className="w-52 h-52 border border-gray-300 rounded-lg shadow-md mb-4"
                        />
                        <p className="text-gray-500 text-xs mb-4">
                            Open WhatsApp → Linked Devices → Scan QR
                        </p>
                        <button
                            onClick={fetchQr}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" /> Refresh QR
                        </button>
                    </>
                )}

                {status === "connected" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-3 w-full"
                    >
                        <div className="flex items-center gap-2">
                            <Wifi className="text-green-500 w-6 h-6" />
                            <CheckCircle className="text-green-500 w-14 h-14" />
                            <Wifi className="text-green-500 w-6 h-6" />
                        </div>
                        <p className="text-green-700 font-semibold">
                            WhatsApp Connected Successfully!
                        </p>
                        
                        {/* Connection Info */}
                        <div className="bg-gray-50 rounded-lg p-3 w-full mt-2 text-left text-sm">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Wifi className="w-4 h-4 text-green-500" />
                                <span>State: <span className="font-medium text-green-600">{connectionState || 'CONNECTED'}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span>Last Activity: <span className="font-medium">{formatLastActivity(lastActivity)}</span></span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <WifiOff className="text-red-500 w-10 h-10 mb-2" />
                        <p className="text-red-600 font-medium mb-2">
                            Failed to connect WhatsApp
                        </p>
                        <button
                            onClick={initializeWhatsapp}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                        >
                            Retry Connection
                        </button>
                    </div>
                )}

                {status === "notReady" && (
                    <div className="flex flex-col items-center">
                        <AlertTriangle className="text-yellow-500 w-10 h-10 mb-2" />
                        <p className="text-yellow-600 font-medium mb-2">
                            WhatsApp is not ready
                        </p>
                        <button
                            onClick={initializeWhatsapp}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                        >
                            Initialize Connection
                        </button>
                    </div>
                )}

                {status !== "connected" && status !== "error" && status !== "notReady" && status !== "checking" && status !== "initializing" && !qrCode && (
                    <div className="mt-6">
                        <button
                            onClick={initializeWhatsapp}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center gap-2 shadow-sm"
                        >
                            <Smartphone className="w-4 h-4" /> Connect WhatsApp
                        </button>
                    </div>
                )}

                {status === "connected" && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <button
                            onClick={fetchStatus}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" /> Refresh Status
                        </button>
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            disabled={isLoggingOut}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4" />
                            )}
                            Logout
                        </button>
                    </div>
                )}

                {/* Show Reconnect button only when disconnected/error */}
                {(status === "error" || status === "notReady") && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleReconnect}
                            disabled={isReconnecting}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isReconnecting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="w-4 h-4" />
                            )}
                            Reconnect
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
                title="Logout WhatsApp"
                message="Are you sure you want to logout? You will need to scan the QR code again to reconnect."
                type="warning"
                confirmText="Logout"
                isLoading={isLoggingOut}
            />
        </div>
    );
};

export default WhatsappConnect;
