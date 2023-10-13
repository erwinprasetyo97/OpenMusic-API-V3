const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist telah dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateManageSongInPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const activity = 'add';

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.checkSongExistance(songId);
    await this._service.addPlaylistActivityLog({
      playlistId, songId, userId: credentialId, activity,
    });
    await this._service.addSongToPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan kedalam playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistWithSongsByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlistSongs = await this._service.getPlaylistWithSongsById(playlistId);
    return playlistSongs;
  }

  async removeSongFromPlaylistHandler(request) {
    this._validator.validateManageSongInPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const activity = 'delete';

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addPlaylistActivityLog({
      playlistId, songId, userId: credentialId, activity,
    });
    await this._service.removeSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivityLogsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.verifyPlaylistAccess(id, credentialId);
    const activityLog = await this._service.getPlaylistActivityLogs(id);

    const response = h.response({
      status: 'success',
      data: activityLog,
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;
