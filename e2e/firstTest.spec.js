describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  });

  it('should open form screen', async () => {
    await expect(element(by.text('Add new user'))).toBeVisible()
  });
  it ('should fire validation on empty name', async () => {
    await element(by.id('nameInput')).typeText('a')
    await element(by.id('nameInput')).clearText()
    await element(by.id('emailInput')).tap()
    await expect(element(by.text('name is a required field'))).toBeVisible()
  })
  it ('should fire validation on empty email', async () => {
    await element(by.id('emailInput')).typeText('a')
    await element(by.id('emailInput')).clearText()
    await element(by.id('nameInput')).tap()
    await expect(element(by.text('email is a required field'))).toBeVisible()
  })
  it ('should fire validation on wrong email', async () => {
    await element(by.id('emailInput')).typeText('a')
    await element(by.id('nameInput')).tap()
    await expect(element(by.text('email must be a valid email'))).toBeVisible()
  })
  it ('should fire validation on empty phone', async () => {
    await element(by.id('phoneNumberInput')).typeText('3')
    await element(by.id('phoneNumberInput')).clearText()
    await element(by.id('nameInput')).tap()
    await expect(element(by.text('phoneNumber is a required field'))).toBeVisible()
  })
  it ('on submit button click validations should fire if validations are not met', async () => {
    await element(by.id('submitButton')).tap()
    await expect(element(by.text('name is a required field'))).toBeVisible()
    await expect(element(by.text('email is a required field'))).toBeVisible()
    await expect(element(by.text('phoneNumber is a required field'))).toBeVisible()
  })
  it ('should go to details screen', async () => {
    await element(by.id('nameInput')).typeText('Marc Jacobs')
    await element(by.id('emailInput')).typeText('marc@jacobs.com')
    await element(by.id('phoneNumberInput')).typeText('7513200000')
    await element(by.id('submitButton')).tap()
    await sleep(2000)
  })
});
