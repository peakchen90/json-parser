const { Token } = require('./shared');

const BRACES_START = '{';
const BRACES_END = '}';
const BRACKETS_START = '[';
const BRACKETS_END = ']';
const DOUBLE_QUOTE = '"';
const COMMA = ',';
const DOT = '.';
const SEPARATOR = ':';
const ESCAPE = '\\';
const NEGATIVE = '-';
const COMMENT_LINE_START = '//';
const COMMENT_BLOCK_START = '/*';
const COMMENT_BLOCK_END = '*/';

const identifierRE = /[A-Za-z]/;
const numberRE = /\d/;
const whitespaceRE = /\s/;
const eolRE = /\r|\n|\r\n/;

function tokenizer(input) {
  const len = input.length;
  let tokens = [];
  let current = 0;
  let line = 1;
  let column = 1;
  let start;
  let end;

  function getLoc() {
    return {
      position: current,
      line,
      column
    };
  }

  function loc() {
    return {
      start,
      end
    };
  }

  function next(isEOL) {
    current++;
    if (isEOL) {
      line++;
      column = 1;
    } else {
      column++;
    }
    return input[current];
  }

  while (current < len) {
    let char = input[current];
    let type;

    // special chars
    if (
      (char === BRACES_START && (type = Token.TYPE.BRACES_START)) ||
      (char === BRACES_END && (type = Token.TYPE.BRACES_END)) ||
      (char === BRACKETS_START && (type = Token.TYPE.BRACKETS_START)) ||
      (char === BRACKETS_END && (type = Token.TYPE.BRACKETS_END)) ||
      (char === COMMA && (type = Token.TYPE.COMMA)) ||
      (char === SEPARATOR && (type = Token.TYPE.SEPARATOR))
    ) {
      start = getLoc();
      next();
      end = getLoc();
      tokens.push(new Token(
        type,
        char,
        loc()
      ));
      continue;
    }

    // string
    if (char === DOUBLE_QUOTE) {
      let value = '';
      start = getLoc();
      char = next();

      while (current < len && (char !== DOUBLE_QUOTE || char === ESCAPE)) {
        if (char === ESCAPE) {
          value += next();
          char = next();
        } else {
          value += char;
          char = next();
        }
      }

      if (char === ESCAPE) {
        throw new SyntaxError(`Unexpected token ${char} in JSON at position ${current}`);
      }

      next();
      end = getLoc();
      tokens.push(new Token(
        Token.TYPE.STRING,
        value,
        loc()
      ));

      continue;
    }

    // number
    if (numberRE.test(char) || char === NEGATIVE) {
      let value = '';
      let hasDOT = false;
      let hasNum = false;
      start = getLoc();

      if (char === NEGATIVE) {
        value = char;
        char = next();
      }

      while (current < len && (numberRE.test(char) || (!hasDOT && char === DOT))) {
        if (char === DOT) {
          hasDOT = true;
        } else {
          hasNum = true;
        }
        value += char;
        char = next();
      }

      if (!hasNum) {
        throw new SyntaxError(`Unexpected token ${char} in JSON at position ${current}`);
      }
      if (input[current - 1] === DOT) {
        throw new SyntaxError(`Unexpected token ${input[current - 1]} in JSON at position ${current - 1}`);
      }

      end = getLoc();
      tokens.push(new Token(
        Token.TYPE.NUMBER,
        value,
        loc()
      ));
      continue;
    }

    // identifier
    if (identifierRE.test(char)) {
      let value = '';
      start = getLoc();

      while (current < len && identifierRE.test(char)) {
        value += char;
        char = next();
      }

      end = getLoc();
      tokens.push(new Token(
        Token.TYPE.IDENTIFIER,
        value,
        loc()
      ));

      continue;
    }

    // whitespace
    if (whitespaceRE.test(char)) {
      let value = '';
      start = getLoc();


      while (current < len && whitespaceRE.test(char)) {
        value += char;
        char = next(eolRE.test(char));
      }

      end = getLoc();
      tokens.push(new Token(
        Token.TYPE.WHITESPACE,
        value,
        loc()
      ));
      continue;
    }

    // comment line
    if (char === COMMENT_LINE_START[0] && input[current + 1] === COMMENT_LINE_START[1]) {
      let value = '';
      start = getLoc();

      while (current < len && !eolRE.test(char)) {
        value += char;
        char = next();
      }

      end = getLoc();
      tokens.push(new Token(
        Token.TYPE.COMMENT_LINE,
        value,
        loc()
      ));

      continue;
    }

    // comment block
    if (char === COMMENT_BLOCK_START[0] && input[current + 1] === COMMENT_BLOCK_START[1]) {
      let value = char;
      let hasClosed = false;
      start = getLoc();
      value += next();
      char = next();

      while (current < len) {
        if (char === COMMENT_BLOCK_END[1] && input[current - 1] === COMMENT_BLOCK_END[0]) {
          value += char;
          hasClosed = true;
          break;
        }
        value += char;
        char = next(eolRE.test(char));
      }

      char = next();
      end = getLoc();

      if (!hasClosed) {
        throw new SyntaxError(`Unexpected token ${char} in JSON at position ${current}`);
      }

      tokens.push(new Token(
        Token.TYPE.COMMENT_BLOCK,
        value,
        loc()
      ));

      continue;
    }

    throw new SyntaxError(`Unexpected token ${char} in JSON at position ${current}`);
  }

  return tokens;
}

module.exports = tokenizer;
