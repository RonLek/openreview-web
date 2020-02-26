// Global helper functions (main.js)
window.serializeUrlParams = function(obj) {
  return decodeURIComponent($.param(_.omitBy(obj, _.isNil)));
};

window.parseUrlParams = function(urlStr) {
  if (typeof urlStr !== 'string') {
    return {};
  }

  urlStr = urlStr.trim().replace(/^\?/, '');
  if (!urlStr) {
    return {};
  }

  return urlStr.trim().split('&').reduce(function(ret, param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    ret[parts[0]] = (parts[1] === undefined) ?
      null :
      decodeURIComponent(parts[1]);
    return ret;
  }, {});
};

window.parseUrl = function(href) {
  var location = document.createElement('a');
  location.href = href;
  // IE doesn't populate all link properties when setting .href with a relative URL,
  // however .href will return an absolute URL which then can be used on itself
  // to populate these additional fields.
  if (location.host === '') {
    // eslint-disable-next-line no-self-assign
    location.href = location.href;
  }
  return location;
};

window.translateErrorMessage = function(error) {
  var topic = error && error.path ? [view.iTerm(error.path)] : '';
  var buildFeebackModalLink = function(linkText, formFields) {
    return $('<a>', {
      href: '#',
      class: 'action-link',
      'data-toggle': 'modal',
      'data-target': '#feedback-modal'
    }).text(linkText).click(function() {
      $('#feedback-modal').find('[name="from"]').val(formFields.from);
      $('#feedback-modal').find('[name="subject"]').val(formFields.subject);
      $('#feedback-modal').find('[name="message"]').val(formFields.message);
    });
  };

  var type2Message = {
    expired: [view.iMess(' has expired')],
    notString: [view.iMess(' is not a string')],
    notEmail: [view.iMess(' is not a valid email address')],
    notValidSyntax: [view.iMess(' does not meet syntax requirements')],
    notArray: [view.iMess(' is not an array')],
    notObject: [view.iMess(' is not an object')],
    forbidden: [view.iMess(' is not accessible by user '), view.iTerm(error.user)],
    notSignatory: (_.isEmpty(error.value)) ? [view.iMess(' is missing')] : [view.iMess(' does not have signatory user '), view.iTerm(error.user)],
    notForum: [view.iMess(' is not a forum of '), view.iTerm(error.value2), view.iMess(' in '), view.iMess(error.path2)],
    notMatch: [view.iMess(' does not meet requirements')],
    missing: [view.iMess(' is missing')],
    fileTooLarge: [view.iMess(' file is too large')],
    invalidFileType: [view.iMess(' is the wrong file type')],
    invalidInvitation: [view.iMess(' is not a valid invitation')],
    alreadyConfirmed: [
      view.iMess(' is already associated with another OpenReview profile, '),
      $('<a>', { href: '/profile?id=' + error.value, title: 'View profile', target: '_blank' }).text(error.value),
      view.iMess('. To merge this profile with your account, please click here to submit a support request: '),
      buildFeebackModalLink('Merge Profiles', {
        from: error.value2,
        subject: 'Merge Profiles',
        message: 'Hi OpenReview Support,\n\nPlease merge the profiles with the following usernames:\n' + error.value2 + '\n' + error.value + '\n\nThank you.'
      })
    ],
    'Invalid Field': [view.iMess(' is invalid')],
    'Not Found': [view.iMess(' could not be found')],
    'cannot override final field': [view.iMess(' is a final field and cannot be edited')]
  };

  if (_.has(type2Message, error.type)) {
    return _.flatten([topic, type2Message[error.type]]);
  } else if (_.isString(error)) {
    return view.iMess(error);
  } else if (error.name && error.name === 'error') {
    return view.iMess(error.errors[0]);
  } else {
    return view.iMess('Something went wrong :(');
  }
};

// Flash Alert Functions (main.js)
var flashMessageTimer;
window.generalPrompt = function(type, content, options) {
  var defaults = {
    html: false,
    noTimeout: false,
    scrollToTop: true,
    overlay: false
  };
  options = _.assign(defaults, options);

  var $outer = $('#flash-message-container');
  $outer.hide();
  if (type === 'error') {
    $outer.removeClass('alert-success alert-warning').addClass('alert-danger');
  } else if (type === 'message') {
    $outer.removeClass('alert-danger alert-warning').addClass('alert-success');
  } else if (type === 'info') {
    $outer.removeClass('alert-danger alert-success').addClass('alert-warning');
  }

  if (options.overlay) {
    $outer.addClass('fixed-overlay');
    options.scrollToTop = false;
  } else {
    $outer.removeClass('fixed-overlay');
  }

  clearTimeout(flashMessageTimer);

  var elemsToRemove = [
    '.alert-content span.important_message',
    '.alert-content span.important_term',
    '.alert-content strong',
    '.alert-content .action-link'
  ];
  $outer.find(elemsToRemove.join(', ')).remove();

  var msgHtml;
  if (options.html) {
    msgHtml = content;
  } else if (type === 'error') {
    var errorLabel = options.hideErrorLabel ? null : '<strong>Error: </strong>';
    msgHtml = _.flatten([errorLabel, translateErrorMessage(content)]);
  } else {
    msgHtml = view.iMess(content);
  }
  $outer.find('.alert-content').append(msgHtml);
  $outer.slideDown();

  if (options.scrollToTop) {
    var scrollOffset = $('#or-banner').is(':visible') ? $('#or-banner').outerHeight() : 0;
    if (window.scrollY > scrollOffset) {
      $('html, body').animate({scrollTop: scrollOffset}, 400);
    }
  }

  if (!options.noTimeout) {
    flashMessageTimer = setTimeout(function() { $outer.slideUp(); }, 8000);
  }
};

window.promptError = function(error, options) {
  generalPrompt('error', error, options);
};

window.promptMessage = function(message, options) {
  generalPrompt('message', message, options);
};

window.promptLogin = function(user) {
  var redirectParam = window.legacyScripts
    ? ''
    : '?redirect=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);

  if (_.isEmpty(user) || _.startsWith(user.id, 'guest_')) {
    generalPrompt(
      'message',
      '<span class="important_message">Please <a href="/login' + redirectParam + '" class="push-link">Login</a> to proceed</span>',
      {html: true}
    );
  } else {
    generalPrompt(
      'message',
      '<span class="important_message">Please <a href="/logout">Login as a different user</a> to proceed</span>',
      {html: true}
    );
  }
};

// Disable legacy JS from interacting with the banner (banner.js)
var noop = function() {};
window.OpenBanner = {
  clear: noop,
  hide: noop,
  show: noop,
  welcome: noop,
  set: noop,
  venueHomepageLink: noop,
  forumLink: noop,
  referrerLink: noop,
  breadcrumbs: noop
}

// Global Event Handlers (index.js)
// Flash message bar
$('#flash-message-container button.close').on('click', function() {
  $('#flash-message-container').slideUp();
});

// Dropdowns
$(document).on('click', function(event) {
  if (!$(event.target).closest('.dropdown').length) {
    $('.dropdown .dropdown_content').hide();
  }
});

// Show/hide details link
$('#content').on('show.bs.collapse', function(e) {
  var $div = $(e.target);
  var $a;
  if ($div.hasClass('note-tags-overflow')) {
    $a = $div.next().children('a').eq(0);
    $a.text('Hide tags');
  } else if ($div.attr('id') === 'child-groups-overflow') {
    $a = $div.parent().next().children('a').eq(0);
    $a.text('Hide child groups');
  } else if ($div.attr('id') === 'related-invitations-overflow') {
    $a = $div.parent().next().children('a').eq(0);
    $a.text('Hide related invitations');
  } else if ($div.attr('id') === 'signed-notes-overflow') {
    $a = $div.parent().next().children('a').eq(0);
    $a.text('Hide signed notes');
  } else {
    $a = $div.prev();
    if ($a.hasClass('note-contents-toggle')) {
      $a.text('Hide details');
    }
  }
});

$('#content').on('hide.bs.collapse', function(e) {
  var $div = $(e.target);
  var $a;
  if ($div.hasClass('note-tags-overflow')) {
    $a = $div.next().children('a').eq(0);
    $a.text('Show ' + $div.find('.tag-widget').length + ' more...');
  } else if ($div.attr('id') === 'child-groups-overflow') {
    $a = $div.parent().next().children('a').eq(0);
    $a.text('Show all child groups...');
  } else if ($div.attr('id') === 'related-invitations-overflow') {
    $a = $div.parent().next().children('a').eq(0);
    $a.text('Show all related invitations...');
  } else if ($div.attr('id') === 'signed-notes-overflow') {
    $a = $div.parent().next().children('a').eq(0);
    $a.text('Show all signed notes...');
  } else {
    $a = $div.prev();
    if ($a.hasClass('note-contents-toggle')) {
      $a.text('Show details');
    }
  }
});

// Forum Replies
$('#content').on('click', 'a.collapse-comment-tree', function(e) {
  var $container = $(this).parent();
  $container.toggleClass('collapsed');

  $(this).html($container.hasClass('collapsed') ? '[+]' : '[&ndash;]');
  return false;
});

// Feedback modal
$('#feedback-modal').on('hidden.bs.modal', function () {
  $(this).find('form')[0].reset();
  $('#flash-message-container').slideUp();
});

$('#feedback-modal').on('shown.bs.modal', function () {
  $('#feedback-modal p').text('Enter your feedback below and we\'ll get back to you as soon as possible');
  $(this).find('.feedback-input').focus();
});

$('#feedback-modal .btn-primary').on('click', function() {
  $('#feedback-modal form').submit();
});

$('#feedback-modal form').on('submit', function() {
  var url = $(this).attr('action');
  var feedbackData = {};
  $.each($(this).serializeArray(), function(i, field) {
    feedbackData[field.name] = field.value || '';
  });

  Webfield.put(url, feedbackData, { handleErrors: false })
    .then(function(res) {
      if (res.status === 'ok') {
        $('#feedback-modal p').text('Successfully submitted feedback.');
      } else {
        $('#feedback-modal p').text('There was an error submitting feedback.');
      }

      setTimeout(function() {
        $('#feedback-modal').modal('hide');
      }, 2000);
    })
    .fail(function(jqXhr, textStatus) {
      $('#feedback-modal p').text('There was an error submitting your feedback: ' + textStatus);
    });

  return false;
});