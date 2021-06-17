class Pageable {
  constructor() {}
}

Pageable.prototype.pagination = (model) => {
  return async (req, res, next) => {
    console.log("in pgination");
    const page = req.query.page > 0 ? Number(req.query.page) : 1;
    const size = req.query.size ? Number(req.query.size) : 50;
    const sort = req.query.size ? Number(req.query.size) : 50;
    const skip = (page - 1) * size;
    // const total =
    const pagination = {
      size: size,
      page: page,
      total: await model.countDocuments().exec(),
    };

    try {
      res.pagination = pagination;
      res.content = await model.find().limit(size).skip(skip).exec();
      next();
    } catch (e) {
      console.log(e);
    }
  };
};

module.exports = new Pageable();
