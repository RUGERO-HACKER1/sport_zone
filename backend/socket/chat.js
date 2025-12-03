module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a tournament chat room
    socket.on('join-tournament-chat', (tournamentId) => {
      socket.join(`tournament-${tournamentId}`);
      console.log(`User ${socket.id} joined tournament chat ${tournamentId}`);
    });

    // Send a chat message in a tournament
    socket.on('send-chat-message', (data) => {
      const { tournamentId, message, userId } = data;
      // Broadcast the message to everyone in the tournament chat room
      io.to(`tournament-${tournamentId}`).emit('new-chat-message', {
        message,
        userId,
        timestamp: new Date(),
      });
    });

    // Handle match updates (if needed)
    socket.on('match-update', (data) => {
      const { tournamentId, matchId, update } = data;
      // Broadcast the match update to everyone in the tournament
      io.to(`tournament-${tournamentId}`).emit('live-match-update', {
        matchId,
        update,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};