import { WebSocket, WebSocketServer } from 'ws';
import type { Server as HttpServer } from 'http';
import type { WebSocket as WS, WebSocketServer as WSS } from 'ws';

const electionSubscribers = new Map();

function subscribe(electionId: number, socket: any){
    if(!electionSubscribers.has(electionId))
        electionSubscribers.set(electionId, new Set());

    electionSubscribers.get(electionId).add(socket);
}

function unsubscribe(electionId: number, socket: any){
    const subscribers = electionSubscribers.get(electionId);
    if(!subscribers) return;
    subscribers.delete(socket);

    if(subscribers.size === 0){
        electionSubscribers.delete(electionId)
    }
}

function cleanupSubscriptions(socket: any){
    for(const electionId of socket.subscriptions){
        unsubscribe(electionId, socket);
    }
}

function broadcastToElection(electionId: number, payload: any){
    const subscribers = electionSubscribers.get(electionId);
    if(!subscribers || subscribers.size === 0) return;

    const message = JSON.stringify(payload);
    for(const client of subscribers){
        if(client.readyState === WebSocket.OPEN){
            client.send(message);
        }
    }
}

function handleMessage(socket: any, data: any){
    let message;
    try {
        message = JSON.parse(data.toString());
    } catch (error) {
        sendJson(socket, { type: error, message: 'Invalid JSON' })
    }

    if(message?.type === "subscribe" && Number.isInteger(message.electionId)){
        subscribe(message.electionId, socket);
        socket.subscriptions.add(message.electionId);
        sendJson(socket, { type: 'subscribed', electionId: message.electionId });
        return;
    }

    if(message?.type === "unsubscribe" && Number.isInteger(message.electionId)){
        unsubscribe(message.electionId, socket);
        socket.subscriptions.delete(message.electionId);
        sendJson(socket, { type: 'unsubscribed', electionId: message.electionId });
        return;
    }

}

// Helper function to send JSON safely
function sendJson(socket: WS, payload: any): void {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}

// Broadcast to all connected clients
function broadcastToAll(wss: WSS, payload: any): void {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        client.send(JSON.stringify(payload));
    }
}

// Attach and initialize websocket server on an HTTP server
export function attachWebSocketServer(server: HttpServer) {
    const wss = new WebSocketServer({ noServer: true, path: '/ws', maxPayload: 1024 * 1024 });
    const interval = setInterval(() => {
        wss.clients.forEach((ws:any) => {
            if(ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        })
    },30000);

    server.on('upgrade', async (req: any, socket, head) => {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);
        if(pathname !== '/ws') return;
        
        // Run Arcjet Logics
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        })
    })

    wss.on('connection', (socket: any) => {
        socket.isAlive = true;
        
        socket.on('pong', () => { socket.isAlive = true });
        
        socket.subscriptions = new Set();
        
        sendJson(socket, { type: 'welcome' });
        
        socket.on('message', (data: any) => {
            handleMessage(socket, data);
        });

        socket.on('error', () => socket.terminate());

        socket.on('close', () => cleanupSubscriptions(socket));

        socket.on('error', console.error);
    });

    wss.on('close', () => clearInterval(interval));


    function broadcastMatchCreated(match: any): void {
        broadcastToAll(wss, { type: 'match_created', data: match });
    }

    function broadcastElection(electionId: number, data: any): void {
        broadcastToElection(electionId, { type: 'election', data });
    }

    function broadcastStats(data: any): void {
        broadcastToAll(wss, { type: 'live_stats', data });
    }

    return { broadcastMatchCreated, broadcastStats, broadcastElection };
}
