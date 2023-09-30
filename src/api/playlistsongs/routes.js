const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistsongHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistsongByIdHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylistsongHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
];

module.exports = routes;
