class Listener {
  constructor(PlaylistsService, mailSender) {
    this._playlistsService = PlaylistsService;
    this._mailSender = mailSender;
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(message.content.toString());

      const playlists = await this._playlistsService.getSongsFromPlaylist(playlistId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlists));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
