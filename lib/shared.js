class Root {
  constructor(child, loc) {
    this.type = 'Root';
    this.child = child;
    this.loc = loc;
  }
}

class ObjectExpression {
  constructor(properties, loc) {
    this.type = 'ObjectExpression';
    this.properties = properties;
    this.loc = loc;
  }
}

class ObjectProperty {
  constructor(key, value, loc) {
    this.type = 'ObjectProperty';
    this.key = key;
    this.value = value;
    this.loc = loc;
  }
}

class ArrayExpression {
  constructor(elements, loc) {
    this.type = 'ArrayExpression';
    this.elements = elements;
    this.loc = loc;
  }
}

class StringLiteral {
  constructor(value, loc) {
    this.type = 'StringLiteral';
    this.value = value;
    this.loc = loc;
  }
}

class NumericLiteral {
  constructor(value, loc) {
    this.type = 'NumericLiteral';
    this.value = value;
    this.loc = loc;
  }
}

class BooleanLiteral {
  constructor(value, loc) {
    this.type = 'BooleanLiteral';
    this.value = value;
    this.loc = loc;
  }
}

class NullLiteral {
  constructor(loc) {
    this.type = 'NullLiteral';
    this.loc = loc;
  }
}

class CommentLine {
  constructor(value, loc) {
    this.type = 'CommentLine';
    this.value = value;
    this.loc = loc;
  }
}

class CommentBlock {
  constructor(value, loc) {
    this.type = 'CommentBlock';
    this.value = value;
    this.loc = loc;
  }
}

class Token {
  constructor(type, value, loc) {
    this.type = type;
    this.value = value;
    this.loc = loc;
  }
}

Token.TYPE = {
  BRACES_START: 'BRACES_START', // '{'
  BRACES_END: 'BRACES_END', // '}'
  BRACKETS_START: 'BRACKETS_START', // '['
  BRACKETS_END: 'BRACKETS_END', // ']'
  SEPARATOR: 'SEPARATOR', // ':'
  COMMA: 'COMMA', // ','

  STRING: 'STRING',
  NUMBER: 'NUMBER',
  IDENTIFIER: 'IDENTIFIER',
  WHITESPACE: 'WHITESPACE',
  COMMENT_LINE: 'COMMENT_LINE',
  COMMENT_BLOCK: 'COMMENT_BLOCK'
};


module.exports = {
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
};
