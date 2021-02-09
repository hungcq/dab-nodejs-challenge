const expect = require('chai').expect;
const product = require('../core/product');

describe('input-validation-test', function () {
  it('get input validation test', function () {
    const nullDataResult = product.validateGetInput();
    expect(nullDataResult).to.deep.equal({
      success: false,
      error: 'Data is null.',
    });

    const validDataResult = product.validateGetInput({});
    expect(validDataResult).to.deep.equal({ success: true });
  });

  it('add product input validation test', function () {
    const nullDataResult = product.validateProductInput();
    expect(nullDataResult).to.deep.equal({
      success: false,
      error: 'Data is null.',
    });

    const validInput = {
      name: 'product A3',
      type: 'A',
      price: 10.5,
    };
    const validDataResult = product.validateProductInput(validInput);
    expect(validDataResult).to.deep.equal({ success: true });

    const { name, ...noNameInput } = validInput;
    const noNameResult = product.validateProductInput(noNameInput);
    expect(noNameResult).to.deep.equal({
      success: false,
      error: 'name is null.',
    });

    const { price, ...noPriceInput } = validInput;
    const noPriceResult = product.validateProductInput(noPriceInput);
    expect(noPriceResult).to.deep.equal({
      success: false,
      error: 'price is null.',
    });

    const invalidPriceInput = {
      ...validInput,
      price: 'string',
    };
    const invalidPriceResult = product.validateProductInput(invalidPriceInput);
    expect(invalidPriceResult).to.deep.equal({
      success: false,
      error: 'price must be a number.',
    });

    const { type, ...noTypeInput } = validInput;
    const noTypeResult = product.validateProductInput(noTypeInput);
    expect(noTypeResult).to.deep.equal({
      success: false,
      error: 'type is null.',
    });
  });
});
