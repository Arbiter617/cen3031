'use strict';
  
describe('login page page', function() {
	//var addButton = element(by.id('addButton'));
  var userName = element(by.id('username'));
  var password = element(by.id('password'));
  var signin = element(by.id('signin'));
  //var error = element(by.model('Missing credentials'));
 

  beforeEach(function () {
    browser.get('/#!/signin');
  });
 
  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  }); 

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('ABET Accreditation');
  });

/*  it('should not login if password is not provided', function() {
    userName.sendKeys('raymondwclark');
    signin.click();
    expect(error.getText()).toMatch('Missing Credentials');
  });*/

  it('should log in user', function() {
    userName.sendKeys('raymondwclark');
    password.sendKeys('Masterchief117');
    signin.click();
  });


});