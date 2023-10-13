const autoBind = require('auto-bind');

class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlist = await this._playlistsService.getPlaylists(playlistId);
      console.log('playlist:', playlist);
      const songs = await this._playlistsService.getSongs(playlistId);
      console.log('songs:', songs);

      const playlistData = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: songs.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      };

      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistData));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
