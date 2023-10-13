exports.up = (pgm) => {
  pgm.sql("UPDATE albums SET cover = 'null' WHERE cover IS NULL");
};

exports.down = (pgm) => {
  pgm.sql("UPDATE albums SET cover = NULL WHERE cover = 'null'");
};
