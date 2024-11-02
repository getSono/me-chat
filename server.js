const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Statische Dateien aus dem public Ordner servieren
app.use(express.static(path.join(__dirname, 'public')));

// Route für die Hauptseite
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io Verbindungen
io.on('connection', (socket) => {
    console.log('Ein Benutzer hat sich verbunden');

    let nickname;

    socket.on('join', (username) => {
        console.log('Neuer Benutzer:', username);
        nickname = username;
        io.emit('userJoined', { user: username });
    });

    socket.on('chatMessage', (message) => {
        console.log('Neue Nachricht:', message);
        io.emit('message', {
            user: nickname,
            text: message,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on('disconnect', () => {
        if (nickname) {
            console.log('Benutzer disconnected:', nickname);
            io.emit('userLeft', { user: nickname });
        }
    });
});

// Server starten
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}); 