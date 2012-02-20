// Backbone.EmberCloneMail
// A reference application for Backbone.Marionette
//
// Copyright (C)2012 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/emberclonemail

// App Selector
// ------------

// The app selector is the drop list on the top left of the
// application that lets you choose between "Mail" and "Contacts".
// Changing the selected app will cause the application to switch to
// that sub-app's contents and functionality.
EmberCloneMail.AppSelection = (function(EmberCloneMail, Backbone){
  var AppSelection = {};

  // The app selection view handles the changing of the app
  // selector drop list.
  AppSelection.AppSelectionView = EmberCloneMail.ItemView.extend({
    events: {
      "change select": "appChanged"
    },

    initialize: function(){
      // Make sure the `setSelection` method is always running in
      // the context of this view.
      _.bindAll(this, "setSelection");

      // Bind the events to show the correct app selection.
      this.setupAppSelectionEvents();
    },

    // Figure out which app is being selected and call the
    // correct object's `show` method.
    appChanged: function(e){
      e.preventDefault();
      var appName = $(e.currentTarget).val();

      if (appName == "mail"){
        EmberCloneMail.MailApp.showInbox();
      } else {
        EmberCloneMail.ContactsApp.showContactList();
      }
    },

    // Show the correct app in the select box.
    setSelection: function(app){
      this.$("select").val(app);
    },

    setupAppSelectionEvents: function(){
      var self = this;

      // When the mail app is shown, be sure we are displaying "Mail"
      // in the app selector.
      EmberCloneMail.vent.bind("mail:show", function(){
        self.setSelection("mail");
      });

      // When the contacts app is shown, be sure we are displaying 
      // "Contacts" in the app selector.
      EmberCloneMail.vent.bind("contacts:show", function(){
        self.setSelection("contacts");
      });
    }
  });

  // Initialize the App Selector functionality when the
  // application starts.
  EmberCloneMail.addInitializer(function(){
    AppSelection.view = new AppSelection.AppSelectionView({
      el: $("#app-selector")
    });
  });

  return AppSelection;
})(EmberCloneMail, Backbone);
