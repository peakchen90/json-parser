const {
  Root,
  ObjectExpression,
  ObjectProperty,
  ArrayExpression,
  StringLiteral,
  NumericLiteral,
  BooleanLiteral,
  NullLiteral,
  CommentLine,
  CommentBlock,
  Token,
} = require('./shared');

function generator(node) {
  let current;

  switch (node.type) {
    case 'Root':
      return generator(node.child);
    case 'ObjectExpression':
      current = {};
      node.properties.forEach(({ key, value }) => {
        key = generator(key);
        value = generator(value);
        current[key] = value;
      });
      return current;
    case 'ArrayExpression':
      current = [];
      node.elements.forEach(element => {
        element = generator(element);
        current.push(element);
      });
      return current;
    case 'StringLiteral':
      return node.value;
    case 'NumericLiteral':
      return node.value;
    case 'BooleanLiteral':
      return node.value;
    case 'NullLiteral':
      return null;
    default:
      throw new TypeError('');
  }
}

module.exports = generator;
