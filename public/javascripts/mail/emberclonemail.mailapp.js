// Backbone.EmberCloneMail
// A reference application for Backbone.Marionette
//
// Copyright (C)2012 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/emberclonemail

// MailApp
// -------

// This is the app controller or sub-application
// for email. It contains all of the 
// high level knowledge of how to run the app
// when it's in mail mode.
EmberCloneMail.MailApp = (function(EmberCloneMail, Backbone){
  var MailApp = {};

  // Email Model And Collection
  // --------------------------

  MailApp.Email = Backbone.Model.extend({});

  MailApp.EmailCollection = EmberCloneMail.Collection.extend({
    url: "/email",
    model: MailApp.Email,

    // Get email for the specified category. Returns a
    // new `EmailCollection` with the filtered contents.
    // If no category is specified, returns `this`.
    forCategory: function(category){
      if (!category){ return this; }

      var filteredMailItems = this.filter(function(email){
        var categories = email.get("categories");
        var found = categories.indexOf(category) >= 0;
        return found;
      });

      var x = new MailApp.EmailCollection(filteredMailItems);
      return x;
    }
  });

  // Mail App Helper Methods
  // -----------------------

  // Filter the mail by the category, if one was specified
  var showFilteredEmailList = function(category){
    MailApp.emailList.onReset(function(list){
      var filteredMail = list.forCategory(category);
      MailApp.MailBox.showMail(filteredMail);
    });
  }

  // Mail App Public API
  // -------------------

  // Show the inbox with all email.
  MailApp.showInbox = function(){
    MailApp.showCategory();
    EmberCloneMail.vent.trigger("mail:show");
  };

  // Show a list of email for the given category.
  MailApp.showCategory = function(category){
    showFilteredEmailList(category);
    MailApp.Categories.showCategoryList();
  };

  // Show an individual email message, by Id
  MailApp.showMessage = function(messageId){
    MailApp.emailList.onReset(function(list){
      var email = list.get(messageId);
      MailApp.MailBox.showMessage(email);
    });
    MailApp.Categories.showCategoryList();
  };

  // Mail App Event Handlers
  // -----------------------

  // When a category is selected, filter the mail list
  // based on it.
  EmberCloneMail.vent.bind("mail:category:show", function(category){
    showFilteredEmailList(category);
  });

  // When the mail app is shown or `inbox` is clicked,
  // show all the mail.
  EmberCloneMail.vent.bind("mail:show", function(){
    showFilteredEmailList();
  });

  // Mail App Initializer
  // --------------------

  // Initializes the email collection object with the list
  // of emails that are passed in from the call to 
  // `EmberCloneMail.start`.
  EmberCloneMail.addInitializer(function(){
    MailApp.emailList = new MailApp.EmailCollection();
    MailApp.emailList.fetch();
  });
  
  return MailApp;
})(EmberCloneMail, Backbone);
