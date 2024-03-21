  /*----------------------------------------------------------------------------*/
  /*---- Pass the liquid script variables ton the preference-centre.js file ----*/
  /*----------------------------------------------------------------------------*/
  var active_email_consent = "{{activeEmailConsent}}"; // Check if any individual email preferences are selected
  var email_consent = "{{emailConsent}}"; // Check if the general email consent preference is selected
  var active_post_consent = "{{activePostConsent}}"; // Check if any individual post preferences are selected
  var post_consent = "{{postConsent}}"; // Check if the general post consent preference is selected
  var active_phone_consent = "{{activePhoneConsent}}"; // Check if any individual phone preferences are selected
  var phone_consent = "{{phoneConsent}}"; // Check if the general phone consent preference is selected
  var active_thirdparty_consent = "{{activeThirdpartyConsent}}"; // Check if any individual third party preferences are selected
  var thirdparty_consent = "{{thirdpartyConsent}}"; // Check if the general third party consent preference is selected

  $(document).ready(function() {
  var unsubscribeAllOff = false;
  $('#cancel').on( 'click', function(e){
    location.reload();
  });
  if ( active_email_consent == "false" && email_consent == "true" ) {
    subscribePreferences('.email');
    unsubscribeAllOff = true;
  }
  if ( active_post_consent == "false" && post_consent == "true" ) {
    subscribePreferences('.post');
    unsubscribeAllOff = true;
  }
  if ( active_phone_consent == "false" && phone_consent == "true" ) {
    subscribePreferences('.phone');
    unsubscribeAllOff = true;
  }
  if ( active_thirdparty_consent == "false" && thirdparty_consent == "true" ) {
    subscribePreferences('.thirdparty');
    unsubscribeAllOff = true;
  }
  if ( unsubscribeAllOff ) {
    unsubscribeOff($('.unsub'), 'false', '', true);
  }

  // Change label text when switch is clicked 
  // Create additional checkbox when switch is not checked to send false value for attribute
  $('.custom-switch').on( 'click', function(e){
    if($(e.target).is(":checkbox")) {
      $('#unsub-emails-error').remove();
      var type = $(this).closest('.preferences').data('type');
      var id = $(this).find('.custom-control-input').attr('id');
      var extended_attr = '[extended_attributes]';
      // If an email preference is enabled then turn unsubscribe emails off
      if ( $('.unsub-emails').find('label').text() == 'Yes' && $(this).find('label').text() == 'No' && type == 'email' ) {
        unsubscribeOff($('.unsub-emails'), 'true', extended_attr, true);
      }
      // If any preference is enabled then turn unsubscribe all off
      if ( $('.unsub').find('label').text() == 'Yes' && $(this).find('label').text() == 'No' && id != "marketing_consent_email" ) {
        unsubscribeOff($('.unsub'), 'false', '', true);
      }
      if ( type == 'email' && id != "marketing_consent_email" ) {
        checkEmailPreferences();
      } else if ( type == 'post' || type == 'phone' || type == 'thirdparty' ) {
        checkPreferences(type);
      }
      // If unsubscribe from emails is selected then turn all email preferences off
      if ( id == "marketing_consent_email" ) {
        var eCount = preferenceCount('email');
        if ( eCount <= 1 ) {
          e.preventDefault();
          $(this).closest('.form-group').append('<div id="unsub-emails-error" class="alert alert-warning mt-2">To subscribe to email marketing please select one or more of the above preferences.</div>');
        } else {
          if ( $(this).find('label').text() == 'No' ) {
            unsubscribePreferences('.email');
          }
          switchChange($(this), 'true', extended_attr);
        }
      // If unsubscribe from all is selected then turn all marketing preferences off
      } else if ( id == "unsubscribed" ) {
        if ( $(this).find('label').text() == 'No' ) {
          unsubscribePreferences('');
          $('#marketing_consent_post').val('false');
          $('#marketing_consent_phone').val('false');
          $('#marketing_consent_thirdparty').val('false');
          subscribeOn($('.unsub-emails'), 'true', '[extended_attributes]', true);
        }
        switchChange($(this), 'false', '');
      } else {
        switchChange($(this), 'false', extended_attr);
      }
    }
  });
  function switchChange(el, checkboxVal, extended) {
    var custom_input = el.find('.custom-control-input');
    var label = el.find('label').text();
    var id = custom_input.attr('id');
    // If preference switch is set to yes remove hidden input field so the preference is saved as true.
    if ( label == 'Yes' ) {
      if ( el.find('.false-control').length <= 0 ) {
        el.append('<input type="hidden" class="false-control"' +
                        'value="' + checkboxVal + '" name="user' + extended + '[' + id + ']">');
      }
      custom_input.attr('name', 'user' + extended + '[' + id + '_OFF]');
      el.find('label').text('No');
    // If preference switch is set to No remove hidden input field so the preference is saved as true.
    } else {
      custom_input.attr('name', 'user' + extended + '[' + id + ']');
      el.find('.false-control').remove();
      el.find('label').text('Yes');
    }
  }
  function unsubscribePreferences(elClass) {
    $('.preferences' + elClass + ' .custom-switch').each(function(i, obj) {
        var custom_input = $(this).find('.custom-control-input');
        var id = custom_input.attr('id');
        if ( $(this).find('label').text() == 'Yes' && id != "marketing_consent_email" && id != "unsubscribed" ) {
          unsubscribeOff($(this), 'false', '[extended_attributes]', true);
        }
    });
  } 
  function subscribePreferences(elClass) {
    $('.preferences' + elClass + ' .custom-switch').each(function(i, obj) {
        var custom_input = $(this).find('.custom-control-input');
        var id = custom_input.attr('id');
        if ( $(this).find('label').text() == 'No' && id != "marketing_consent_email" && id != "unsubscribed" ) {
          subscribeOn($(this), 'true', '[extended_attributes]', true);
        }
    });
  }
  function unsubscribeOff(el, checkboxVal, extended, setChecked) {
    var custom_input = el.find('.custom-control-input');
    var id = custom_input.attr('id');
    if ( el.find('.false-control').length <= 0 ) {
      el.append('<input type="hidden" class="false-control"' +
                  'value="' + checkboxVal + '" name="user' + extended + '[' + id + ']">');
    }
    custom_input.attr('name', 'user' + extended + '[' + id + '_OFF]');
    custom_input.prop('checked',false);
    el.find('label').text('No');
  }
  function subscribeOn(el, checkboxVal, extended, setChecked) {
    var custom_input = el.find('.custom-control-input');
    var id = custom_input.attr('id');
    custom_input.attr('name', 'user' + extended + '[' + id + ']');
    custom_input.prop('checked',checkboxVal);
    el.find('.false-control').remove();
    el.find('label').text('Yes');
  }
  function checkEmailPreferences() {
    var eCount = preferenceCount('email');
    if ( eCount < 1 && $('.unsub-emails').find('label').text() == 'No' ) {
      subscribeOn($('.unsub-emails'), 'true', '[extended_attributes]', true);
    }
  }
  function checkPreferences(type) {
    var eCount = preferenceCount(type);
    console.log('count:' + eCount);
    if ( eCount < 1 ) {
      $('#marketing_consent_' + type).val('false');
    } else {
      $('#marketing_consent_' + type).val('true');
    }
  }
  function preferenceCount(type) {
    var eCount = 0;
    $('.preferences.' + type + ' .custom-switch').each(function(i, obj) {
        var custom_input = $(this).find('.custom-control-input');
        if ( custom_input.is(":checked") ) {
          eCount = eCount + 1;
        }
    });
    return eCount;
  }
  $('#loader').fadeOut();
});