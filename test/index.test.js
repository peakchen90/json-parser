const parse = require('../lib');

describe('JSON Parser', () => {

  test('string', () => {
    let str = `{"a": "a"}`;
    const obj = parse(str);
    expect(obj.a).toBe('a');
  });

  test('root string', () => {
    let str = `"a"`;
    const obj = parse(str);
    expect(obj).toBe('a');
  });

  test('number', () => {
    let str = `{"a": 123}`;
    const obj = parse(str);
    expect(obj.a).toBe(123);
  });

  test('root number', () => {
    let str = `123`;
    const obj = parse(str);
    expect(obj).toBe(123);
  });

  test('null', () => {
    let str = `{"a": null}`;
    const obj = parse(str);
    expect(obj.a).toBe(null);
  });

  test('root null', () => {
    let str = `null`;
    const obj = parse(str);
    expect(obj).toBe(null);
  });

  test('boolean', () => {
    let str = `{"a": true, "b": false}`;
    const obj = parse(str);
    expect(obj.a).toBe(true);
    expect(obj.b).toBe(false);
  });

  test('root boolean', () => {
    let str1 = `true`;
    let str2 = `false`;
    expect(parse(str1)).toBe(true);
    expect(parse(str2)).toBe(false);
  });

  test('array', () => {
    let str = `{"a": ["a", 123, true, null]}`;
    const obj = parse(str);
    expect(obj.a).toEqual(['a', 123, true, null]);
  });

  test('root array', () => {
    let str = `["a", "b", 1]`;
    const obj = parse(str);
    expect(obj).toEqual(['a', 'b', 1]);
  });

  test('ignore single line comment', () => {
    let str = `{
      // comment 1
      "a": /*
        comment 2
      */ "a" // comment 3
      // comment 4
    }`;
    const obj = parse(str);
    expect(obj.a).toEqual('a');
  });

  test('mixin', () => {
    let str = `
    {
      "a": "hello world",
      "b": 123,
      "\\"c\\"": "\\"quotes\\"",
      "d": [
        [1, "d12", { "d13": "d13"}],
        {
          "d21" : true
        }
      ]
    }
    `;
    const obj = parse(str);
    expect(obj.a).toBe('hello world');
    expect(obj.b).toBe(123);
    expect(obj['"c"']).toBe('"quotes"');
    expect(obj.d).toEqual([[1, 'd12', { 'd13': 'd13' }], { 'd21': true }]);
  });
});
