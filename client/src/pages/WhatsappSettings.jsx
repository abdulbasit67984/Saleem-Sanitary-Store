/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import config from "../features/config";

const WhatsappConnect = () => {
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState("checking");
    const [notification, setNotification] = useState("");

    const showNotification = (msg, type = "info") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(""), 3000);
    };

    const fetchQr = async () => {
        try {
            setStatus("waiting");
            const data = await config.getQrCode();
            console.log('qr data', data)
            if (data?.qr) {
                setQrCode(data.qr);
            } else {
                setStatus("notReady");
            }
        } catch (err) {
            console.error("QR Fetch Error:", err);
            setStatus("error");
        }
    };

    const fetchStatus = async () => {
        try {
            const data = await config.checkWhatsappStatus();
            //   console.log('data', data)
            if (data?.ready) {
                setStatus("connected");
                setQrCode(null);
            } else {
                fetchQr();
            }
        } catch (err) {
            console.error("Status Error:", err);
            setStatus("error");
        }
    };

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

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-5 right-5 px-4 py-2 rounded-md text-sm shadow-lg z-50 ${notification.type === "error"
                        ? "bg-red-100 text-red-700 border border-red-300"
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
                    </div>
                )}

                {status === "waiting" && !qrCode && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-3" />
                        <p className="text-gray-600">Generating QR Code...</p>
                    </div>
                )}

                {status === "waiting" && (
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
                    </>
                )}

                {status === "connected" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <CheckCircle className="text-green-500 w-14 h-14" />
                        <p className="text-green-700 font-semibold">
                            WhatsApp Connected Successfully!
                        </p>
                    </motion.div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <AlertTriangle className="text-red-500 w-10 h-10 mb-2" />
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

                {status !== "connected" && status !== "error" && (
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
                    <div className="flex gap-2">
                        <button
                            onClick={fetchStatus}
                            className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" /> Refresh Status
                        </button>
                        <button
                            onClick={initializeWhatsapp}
                            className="mt-6 px-4 py-2 bg-green-400 hover:bg-green-500 text-gray-700 rounded-md text-sm flex items-center gap-2"
                        >
                            <Smartphone className="w-4 h-4" /> Restart WhatsApp
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default WhatsappConnect;
