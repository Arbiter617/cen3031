'use strict';
  
describe('manage courses admin page', function() {
	//var addButton = element(by.id('addButton'));
  var addButton = element(by.id('addButton'));
  var courseID = element(by.id('courseID'));
  var courseName = element(by.id('courseName'));
  var courseTerm = element(by.id('courseTerm'));
  var courseYear = element(by.id('courseYear'));
  var submit = element(by.id('submit'));
  var edit = element(by.id('edit'));
  var remove = element(by.id('remove'));
  var courseIDLabel = element(by.id('courseIDLabel'));



  beforeEach(function () {
    browser.get('/#!/manage-courses-admin');
  });
 
  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  }); 

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('ABET Accreditation');
  });

  it('should fill out required fields', function() {
    addButton.click();
    courseID.sendKeys('sample course ID');
    courseName.sendKeys('sample course');
    courseTerm.sendKeys('Fall');
    courseYear.sendKeys('2014');
    submit.click();
    expect(courseIDLabel.getText()).toEqual('sample course ID');
  });

  it('should edit the course description', function() {
    edit.click();
    courseID.clear();
    courseID.sendKeys('Edited course ID');
    submit.click();
    expect(courseIDLabel.getText()).toEqual('Edited course ID');

  });

  it('should remove course', function() {
    remove.click();
  });

  

});