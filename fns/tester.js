const add = function add(property, value) {
  this[property] = value;
};

const show = function show(cb) {
  cb && cb(this);
};

module.exports = function tester(options = {}) {
  const defaultOptions = {};
  const endOptions = Object.assign({}, defaultOptions, options);

  const composedStateObj = Object.assign(
    Object.assign({}),
    { add, show },
    endOptions
  );
  return composedStateObj;
};
