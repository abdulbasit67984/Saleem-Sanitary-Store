// server/src/services/whatsapp.service.js

import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';

const { Client, LocalAuth } = pkg;

// Emit QR updates to frontend
export const whatsappEmitter = new EventEmitter();

let client = null;
let clientReady = false;
let currentQr = null;
let messageQueue = [];

// Persistent authentication directory
const authDir = path.join(process.cwd(), "whatsapp_auth");
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);


/* --------------------------------------------------------
   INIT WHATSAPP 
---------------------------------------------------------*/

export const initWhatsapp = async () => {
    try {
        console.log("🚀 Starting WhatsApp Service...");

        // Avoid duplicate initialization
        if (client && clientReady) {
            console.log("⚙️ WhatsApp already initialized");
            return;
        }

        // Create WhatsApp Client
        client = new Client({
            authStrategy: new LocalAuth({
                clientId: "pandas-session",
                dataPath: authDir,
            }),
            puppeteer: {
                headless: true,
                executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                ],
            },
        });

        /* --------------------------
            QR EVENT
        ---------------------------*/
        client.on("qr", async qr => {
            currentQr = await qrcode.toDataURL(qr);
            whatsappEmitter.emit("qr", currentQr);
            console.log("📱 WhatsApp QR generated");
        });

        /* --------------------------
            READY EVENT
        ---------------------------*/
        client.on("ready", () => {
            clientReady = true;
            console.log("✅ WhatsApp is READY!");

            // Process queued messages
            if (messageQueue.length > 0) {
                console.log(`📨 Processing ${messageQueue.length} queued messages...`);
                messageQueue.forEach(async (item) => {
                    await sendWhatsappMessage(item.number, item.message);
                });
                messageQueue = [];
            }
        });

        /* --------------------------
            DISCONNECTED EVENT
        ---------------------------*/
        client.on("disconnected", async (reason) => {
            console.log("⚠️ WhatsApp Disconnected:", reason);
            clientReady = false;

            console.log("♻️ Restarting WhatsApp...");
            await restartWhatsapp();
        });

        /* --------------------------
            ERROR EVENT
        ---------------------------*/
        client.on("auth_failure", (msg) => {
            console.error("❌ AUTH ERROR:", msg);
        });

        client.on("change_state", (state) => {
            console.log("🔄 WhatsApp State:", state);
        });

        /* --------------------------
            INIT CLIENT
        ---------------------------*/
        await client.initialize();

    } catch (err) {
        console.error("❌ WhatsApp Init Error:", err);
        await restartWhatsapp();
    }
};



/* --------------------------------------------------------
   RESTART WHATSAPP SAFELY
---------------------------------------------------------*/

export const restartWhatsapp = async () => {
    try {
        console.log("🔁 Restarting WhatsApp Client...");

        if (client) {
            await client.destroy().catch(() => { });
        }

        client = null;
        clientReady = false;

        await new Promise(res => setTimeout(res, 3000)); // small pause
        await initWhatsapp();

    } catch (err) {
        console.error("❌ WHATSAPP RESTART FAILED:", err);
    }
};



/* --------------------------------------------------------
   GET QR
---------------------------------------------------------*/
export const getQrCode = async () => {
    if (currentQr) return { qr: currentQr };
    return { message: "QR not generated yet" };
};



/* --------------------------------------------------------
   CHECK STATUS
---------------------------------------------------------*/
export const checkWhatsappStatus = async () => {
    return { ready: clientReady };
};



/* --------------------------------------------------------
   SEND MESSAGE
---------------------------------------------------------*/

export const sendWhatsappMessage = async (number, message) => {
    try {
        const chatId = number.includes("@c.us") ? number : `${number}@c.us`;

        if (!clientReady) {
            console.log(`⏳ WhatsApp not ready → queued message: ${number}`);
            messageQueue.push({ number: chatId, message });
            return { status: "queued", number };
        }

        await client.sendMessage(chatId, message);
        console.log(`📤 Message SENT to ${number}`);

        return { status: "sent", number, message };

    } catch (err) {
        console.error("❌ WhatsApp send error:", err);

        // in case client died mid-send
        if (err.message.includes("Session closed")) {
            console.log("⚠️ Detected session crash → Restarting WhatsApp...");
            await restartWhatsapp();
        }

        return { status: "failed", error: err.message };
    }
};



/* --------------------------------------------------------
   SHUTDOWN SAFELY
---------------------------------------------------------*/

process.on("SIGINT", async () => {
    console.log("🧹 Shutting down WhatsApp...");
    if (client) await client.destroy().catch(() => { });
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("🧹 Cleaning up (SIGTERM)...");
    if (client) await client.destroy().catch(() => { });
    process.exit(0);
});
