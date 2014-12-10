'use strict';
  
describe('manage courses page', function() {
  var addButton = element(by.id('addButton'));
  var removeButton = element(by.id('removeButton'));
  var chooseCourse = element(by.id('chooseCourse'));

   var selectDropdownbyNum = function (element, optionNum ) {
    if (optionNum){
      var options = element.findElements(by.tagName('cen'))   
        .then(function(options){
          options[optionNum].click();
        });
    }
  };

  beforeEach(function () {
    browser.get('/#!/manage-courses');
  });
 
  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  }); 

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('ABET Accreditation');
  });

  it('should add course', function() {     
     addButton.click();
     
  });

  it('should remove course', function() {
    //removeButton.click();
  });

});