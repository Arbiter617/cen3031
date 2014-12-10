'use strict';
  
describe('manage outcomes page', function() {
	//var addButton = element(by.id('addButton'));
  var addButton = element(by.id('addButton'));
  var outcomeIDField = element(by.id('outcomeID'));
  var outcomeNameField = element(by.id('outcomeName'));
  var submitButton = element(by.id('submit'));

  beforeEach(function () {
    browser.get('/#!/manage-outcomes');
  });
 
  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  }); 

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('ABET Accreditation');
  });

  it('should submit an outcome', function() {
    addButton.click();
    outcomeIDField.sendKeys('sample ID');
    outcomeNameField.sendKeys('sample name');
    submitButton.click();
  });

  it('should not submit with empty fields', function() {
    addButton.click();
    outcomeIDField.sendKeys('sample ID');
    submitButton.click();
  });

});