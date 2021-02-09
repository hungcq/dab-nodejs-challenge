const expect = require('chai').expect;
const action = require('../core/action');

describe('input-validation-test', function () {
  it('add action input validation test', function () {
    const nullDataResult = action.validateActionInput();
    expect(nullDataResult).to.deep.equal({
      success: false,
      error: 'Data is null.',
    });

    const validInput = {
      timestamp: 1000,
      type: 'search',
      data: {},
    };
    const validDataResult = action.validateActionInput(validInput);
    expect(validDataResult).to.deep.equal({ success: true });

    const { timestamp, ...noTimestampInput } = validInput;
    const noTimestampResult = action.validateActionInput(noTimestampInput);
    expect(noTimestampResult).to.deep.equal({
      success: false,
      error: 'timestamp is null.',
    });

    const invalidTimestampInput = { ...validInput, timestamp: 'a string' };
    const invalidTimestampResult = action.validateActionInput(invalidTimestampInput);
    expect(invalidTimestampResult).to.deep.equal({
      success: false,
      error: 'timestamp is not a number.',
    });

    const { type, ...noTypeInput } = validInput;
    const noTypeResult = action.validateActionInput(noTypeInput);
    expect(noTypeResult).to.deep.equal({
      success: false,
      error: 'type is null.',
    });
  });
});
