const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);

    const response = h.response({
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    });
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album telah diperbarui',
    });
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'Album telah dihapus',
    });
    return response;
  }

  async postAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.verifyAlbumLikes(albumId, credentialId);
    await this._service.addAlbumLikes(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Anda menyukai album ini',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const { likes, dataSource } = await this._service.getAlbumLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(likes, 10),
      },
    });
    response.header('X-Data-Source', dataSource);
    return response;
  }

  // async getAlbumLikesHandler(request, h) {
  //   const { id } = request.params;
  //   try {
  //     const { likes, dataSource } = await this._service.getAlbumLikes(id, true);
  //     const response = h.response({
  //       status: 'success',
  //       data: {
  //         likes: parseInt(likes, 10),
  //       },
  //     });
  //     response.header('X-Data-Source', dataSource);
  //     return response;
  //   } catch (error) {
  //     const { likes, dataSource } = await this._service.getAlbumLikes(id, false);
  //     const response = h.response({
  //       status: 'success',
  //       data: {
  //         likes: parseInt(likes, 10),
  //       },
  //     });
  //     response.header('X-Data-Source', dataSource);
  //     return response;
  //   }
  // }

  async deleteAlbumLikesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.deleteAlbumLikes(albumId, credentialId);
    return {
      status: 'success',
      message: 'Batal menyukai album',
    };
  }
}

module.exports = AlbumsHandler;
