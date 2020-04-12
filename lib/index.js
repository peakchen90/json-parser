const tokenizer = require('./tokenizer');
const parser = require('./parser');
const generator = require('./generator');

module.exports = function parse(str) {
  const tokens = tokenizer(str);
  const ast = parser(tokens);
  return generator(ast);
};
