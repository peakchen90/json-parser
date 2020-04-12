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

const TOKEN_TYPE = Token.TYPE;

function loc(startToken, endToken) {
  return {
    start: startToken.loc.start,
    end: endToken.loc.end
  };
}

function parser(tokens) {
  const len = tokens.length;
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (!token) {
      return null;
    }

    if (token.type === TOKEN_TYPE.WHITESPACE) {
      token = tokens[++current];
      return walk();
    }

    if (token.type === TOKEN_TYPE.COMMENT_LINE || token.type === TOKEN_TYPE.COMMENT_BLOCK) {
      token = tokens[++current];
      return walk();
    }

    // object expression
    if (token.type === TOKEN_TYPE.BRACES_START) {
      const node = new ObjectExpression([]);
      const start = token;
      let hasEnd = false;
      let key;
      let value;
      let sep;

      function pushProperty() {
        if (key && value) {
          node.properties.push(
            new ObjectProperty(key, value, loc(key, value))
          );
          key = value = sep = null;
        }
      }

      token = tokens[++current];

      while (current < len && !hasEnd) {
        switch (token.type) {
          case TOKEN_TYPE.BRACES_END:
            hasEnd = true;
            // token = tokens[++current];
            pushProperty();
            break;
          case TOKEN_TYPE.WHITESPACE:
            token = tokens[++current];
            break;
          case TOKEN_TYPE.COMMENT_LINE:
          case TOKEN_TYPE.COMMENT_BLOCK:
            token = tokens[++current];
            break;
          case TOKEN_TYPE.STRING:
            key = new StringLiteral(token.value, token.loc);
            token = tokens[++current];
            break;
          case TOKEN_TYPE.SEPARATOR:
            if (!key) {
              throw new SyntaxError('');
            }
            sep = token;
            token = tokens[++current];
            value = walk();
            token = tokens[++current];
            break;
          case TOKEN_TYPE.COMMA:
            if (!key || !sep || !value) {
              throw new SyntaxError('');
            }
            pushProperty();
            token = tokens[++current];
            break;
          default:
            throw new SyntaxError('');
        }
      }

      const end = tokens[current - 1];
      node.loc = loc(start, end);
      return node;
    }

    // array expression
    if (token.type === TOKEN_TYPE.BRACKETS_START) {
      const node = new ArrayExpression([]);
      const start = token;
      let hasEnd = false;
      let value;

      function pushElement() {
        if (value) {
          node.elements.push(value);
          value = null;
        }
      }

      token = tokens[++current];

      while (current < len && !hasEnd) {
        switch (token.type) {
          case TOKEN_TYPE.BRACKETS_END:
            hasEnd = true;
            // token = tokens[++current];
            pushElement();
            break;
          case TOKEN_TYPE.WHITESPACE:
            token = tokens[++current];
            break;
          case TOKEN_TYPE.COMMENT_LINE:
          case TOKEN_TYPE.COMMENT_BLOCK:
            token = tokens[++current];
            break;
          case TOKEN_TYPE.COMMA:
            if (!value) {
              throw new SyntaxError('');
            }
            token = tokens[++current];
            pushElement();
            break;
          default:
            value = walk();
            token = tokens[++current];
        }
      }

      const end = tokens[current - 1];
      node.loc = loc(start, end);
      return node;
    }

    // string
    if (token.type === TOKEN_TYPE.STRING) {
      return new StringLiteral(token.value, token.loc);
    }

    // number
    if (token.type === TOKEN_TYPE.NUMBER) {
      return new NumericLiteral(Number(token.value), token.loc);
    }

    // boolean null
    if (token.type === TOKEN_TYPE.IDENTIFIER) {
      switch (token.value) {
        case 'true':
          return new BooleanLiteral(true, token.loc);
        case 'false':
          return new BooleanLiteral(false, token.loc);
        case 'null':
          return new NullLiteral(token.loc);
        default:
          throw new SyntaxError('');
      }
    }

    throw new SyntaxError('');
  }

  return new Root(walk(), loc(tokens[0], tokens[len - 1]));
}

module.exports = parser;
