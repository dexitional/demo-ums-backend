"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachWebSocketServer = attachWebSocketServer;
const ws_1 = require("ws");
const electionSubscribers = new Map();
function subscribe(electionId, socket) {
    if (!electionSubscribers.has(electionId))
        electionSubscribers.set(electionId, new Set());
    electionSubscribers.get(electionId).add(socket);
}
function unsubscribe(electionId, socket) {
    const subscribers = electionSubscribers.get(electionId);
    if (!subscribers)
        return;
    subscribers.delete(socket);
    if (subscribers.size === 0) {
        electionSubscribers.delete(electionId);
    }
}
function cleanupSubscriptions(socket) {
    for (const electionId of socket.subscriptions) {
        unsubscribe(electionId, socket);
    }
}
function broadcastToElection(electionId, payload) {
    const subscribers = electionSubscribers.get(electionId);
    if (!subscribers || subscribers.size === 0)
        return;
    const message = JSON.stringify(payload);
    for (const client of subscribers) {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(message);
        }
    }
}
function handleMessage(socket, data) {
    let message;
    try {
        message = JSON.parse(data.toString());
    }
    catch (error) {
        sendJson(socket, { type: error, message: 'Invalid JSON' });
    }
    if ((message === null || message === void 0 ? void 0 : message.type) === "subscribe" && Number.isInteger(message.electionId)) {
        subscribe(message.electionId, socket);
        socket.subscriptions.add(message.electionId);
        sendJson(socket, { type: 'subscribed', electionId: message.electionId });
        return;
    }
    if ((message === null || message === void 0 ? void 0 : message.type) === "unsubscribe" && Number.isInteger(message.electionId)) {
        unsubscribe(message.electionId, socket);
        socket.subscriptions.delete(message.electionId);
        sendJson(socket, { type: 'unsubscribed', electionId: message.electionId });
        return;
    }
}
// Helper function to send JSON safely
function sendJson(socket, payload) {
    if (socket.readyState !== ws_1.WebSocket.OPEN)
        return;
    socket.send(JSON.stringify(payload));
}
// Broadcast to all connected clients
function broadcastToAll(wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== ws_1.WebSocket.OPEN)
            continue;
        client.send(JSON.stringify(payload));
    }
}
// Attach and initialize websocket server on an HTTP server
function attachWebSocketServer(server) {
    const wss = new ws_1.WebSocketServer({ noServer: true, path: '/ws', maxPayload: 1024 * 1024 });
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false)
                return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);
    server.on('upgrade', (req, socket, head) => __awaiter(this, void 0, void 0, function* () {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);
        if (pathname !== '/ws')
            return;
        // Run Arcjet Logics
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    }));
    wss.on('connection', (socket) => {
        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });
        socket.subscriptions = new Set();
        sendJson(socket, { type: 'welcome' });
        socket.on('message', (data) => {
            handleMessage(socket, data);
        });
        socket.on('error', () => socket.terminate());
        socket.on('close', () => cleanupSubscriptions(socket));
        socket.on('error', console.error);
    });
    wss.on('close', () => clearInterval(interval));
    function broadcastMatchCreated(match) {
        broadcastToAll(wss, { type: 'match_created', data: match });
    }
    function broadcastElection(electionId, data) {
        broadcastToElection(electionId, { type: 'election', data });
    }
    function broadcastStats(data) {
        broadcastToAll(wss, { type: 'live_stats', data });
    }
    return { broadcastMatchCreated, broadcastStats, broadcastElection };
}
