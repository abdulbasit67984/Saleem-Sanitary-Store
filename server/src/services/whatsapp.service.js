// server/src/services/whatsapp.service.js
// SIMPLIFIED AND ROBUST VERSION

import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';

const { Client, LocalAuth } = pkg;

export const whatsappEmitter = new EventEmitter();

// ============ SINGLETON STATE ============
let client = null;
let isReady = false;
let isInitializing = false;  // Simple boolean mutex
let currentQr = null;
let messageQueue = [];
let keepAliveInterval = null;

const authDir = path.join(process.cwd(), "whatsapp_auth");
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

console.log(" WhatsApp Service Loaded");

// ============ HELPERS ============
const stopKeepAlive = () => {
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
    }
};

const startKeepAlive = () => {
    stopKeepAlive();
    
    // Simple keep-alive - just ping to keep connection active
    // Don't check state as it's unreliable (often returns null even when connected)
    keepAliveInterval = setInterval(async () => {
        if (client && isReady) {
            try {
                // Just get state to keep connection alive, but don't react to it
                await client.getState();
                console.log("💓 Ping OK");
            } catch (e) {
                // Only log errors, don't disconnect
                console.log("💓 Ping failed:", e.message);
            }
        }
    }, 60000); // Every 60 seconds
    console.log("💓 Keep-alive started");
};

// ============ INIT WHATSAPP ============
export const initWhatsapp = async () => {
    // MUTEX: Block if already initializing or ready
    if (isInitializing) {
        console.log(" Already initializing...");
        return { status: "initializing" };
    }
    
    if (client && isReady) {
        console.log(" Already connected");
        return { status: "connected" };
    }

    // SET MUTEX
    isInitializing = true;
    console.log(" Starting WhatsApp...");

    try {
        // Cleanup old client if exists
        if (client) {
            try {
                client.removeAllListeners();
                await client.destroy();
            } catch (e) {}
            client = null;
        }
        
        isReady = false;
        currentQr = null;

        // Create new client with Chrome browser
        const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
        const useChrome = fs.existsSync(chromePath);
        
        if (useChrome) {
            console.log("🌐 Using Chrome browser");
        } else {
            console.log("🌐 Using bundled Chromium");
        }
        
        client = new Client({
            authStrategy: new LocalAuth({
                clientId: "pandas-session",
                dataPath: authDir,
            }),
            puppeteer: {
                headless: true,
                executablePath: useChrome ? chromePath : undefined,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--no-first-run",
                    "--disable-extensions",
                    "--disable-default-apps",
                    "--disable-translate",
                    "--disable-sync",
                    "--disable-background-networking",
                    "--metrics-recording-only",
                    "--mute-audio",
                    "--no-default-browser-check",
                    "--autoplay-policy=user-gesture-required",
                ],
                defaultViewport: null,
            },
            qrMaxRetries: 10,
            authTimeoutMs: 120000,
        });

        // QR Event
        client.on("qr", async (qr) => {
            if (isReady) return;
            try {
                currentQr = await qrcode.toDataURL(qr);
                whatsappEmitter.emit("qr", currentQr);
                console.log(" QR ready");
            } catch (e) {
                console.error("QR error:", e.message);
            }
        });

        // Authenticated
        client.once("authenticated", () => {
            console.log(" Authenticated");
            currentQr = null;
        });

        // Ready
        client.once("ready", () => {
            isReady = true;
            isInitializing = false;
            currentQr = null;
            console.log("✅ WhatsApp READY!");
            whatsappEmitter.emit("status", { ready: true });
            startKeepAlive();
            processQueue();
        });

        // State changes - for debugging
        client.on("change_state", (state) => {
            console.log(`📊 State changed: ${state}`);
        });

        // Loading screen event
        client.on("loading_screen", (percent, message) => {
            console.log(`⏳ Loading: ${percent}% - ${message}`);
        });

        // Remote session saved
        client.on("remote_session_saved", () => {
            console.log("💾 Remote session saved");
        });

        // Disconnected
        client.on("disconnected", (reason) => {
            console.log("❌ DISCONNECTED:", reason);
            console.log("❌ Disconnect time:", new Date().toISOString());
            isReady = false;
            isInitializing = false;
            stopKeepAlive();
            whatsappEmitter.emit("disconnected", { reason });
        });

        // Auth failure
        client.on("auth_failure", (msg) => {
            console.error("❌ Auth failed:", msg);
            isReady = false;
            isInitializing = false;
        });

        // Catch any errors on the client
        client.on("error", (error) => {
            console.error("❌ Client error:", error);
        });

        console.log("⏳ Initializing...");
        await client.initialize();
        
        // Monitor the puppeteer browser
        if (client.pupBrowser) {
            client.pupBrowser.on("disconnected", () => {
                console.log("❌ BROWSER DISCONNECTED!");
                isReady = false;
                stopKeepAlive();
            });
        }
        
        return { status: "started" };

    } catch (err) {
        console.error(" Init error:", err.message);
        isInitializing = false;
        isReady = false;
        return { status: "error", error: err.message };
    }
};

// ============ PROCESS MESSAGE QUEUE ============
const processQueue = async () => {
    if (messageQueue.length === 0) return;
    console.log(` Processing ${messageQueue.length} queued messages`);
    const queue = [...messageQueue];
    messageQueue = [];
    for (const item of queue) {
        try {
            await sendWhatsappMessage(item.number, item.message);
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.error("Queue error:", e.message);
        }
    }
};

// ============ GET QR CODE ============
export const getQrCode = async () => {
    if (isReady) return { ready: true };
    if (currentQr) return { qr: currentQr };
    if (isInitializing) return { initializing: true };
    return { notStarted: true };
};

// ============ CHECK STATUS ============
export const checkWhatsappStatus = async () => {
    let state = null;
    if (client && isReady) {
        try {
            state = await client.getState();
        } catch (e) {
            state = "UNKNOWN";
        }
    }
    return { 
        ready: isReady, 
        state,
        initializing: isInitializing
    };
};

// ============ SEND MESSAGE ============
export const sendWhatsappMessage = async (number, message) => {
    try {
        let num = number.toString().replace(/\D/g, '');
        if (num.startsWith('0')) {
            num = '92' + num.substring(1);
        }
        const chatId = `${num}@c.us`;

        if (!isReady || !client) {
            messageQueue.push({ number: num, message });
            return { status: "queued" };
        }

        await client.sendMessage(chatId, message);
        console.log(` Sent to ${num}`);
        return { status: "sent" };
    } catch (err) {
        console.error("Send error:", err.message);
        return { status: "failed", error: err.message };
    }
};

// ============ LOGOUT ============
export const logoutWhatsapp = async () => {
    try {
        console.log("🚪 Logging out...");
        console.log("🚪 Call stack:", new Error().stack);
        stopKeepAlive();
        
        if (client) {
            try { await client.logout(); } catch (e) {}
            try { client.removeAllListeners(); await client.destroy(); } catch (e) {}
            client = null;
        }
        
        isReady = false;
        isInitializing = false;
        currentQr = null;

        // Clear session
        const sessionPath = path.join(authDir, 'session-pandas-session');
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }
        
        return { success: true };
    } catch (err) {
        console.error("Logout error:", err.message);
        return { success: false, error: err.message };
    }
};

// ============ RECONNECT ============
export const forceReconnect = async () => {
    // If already connected and ready, DON'T reconnect
    if (isReady && client) {
        console.log("✅ Already connected - refusing to reconnect");
        return { status: "already_connected", message: "WhatsApp is already connected. Use Logout first if you want to disconnect." };
    }
    
    // If already initializing, don't do anything
    if (isInitializing) {
        console.log("⏳ Already initializing");
        return { status: "already_initializing" };
    }
    
    console.log("🔄 Reconnecting...");
    
    // Cleanup without clearing session files
    stopKeepAlive();
    if (client) {
        try { client.removeAllListeners(); await client.destroy(); } catch (e) {}
        client = null;
    }
    isReady = false;
    isInitializing = false;
    
    await new Promise(r => setTimeout(r, 2000));
    return initWhatsapp();
};
