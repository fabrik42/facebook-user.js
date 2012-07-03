describe('FacebookUser', function() {

  var user;

  beforeEach(function(){
    user = new FacebookUser();
  });

  FB = jasmine.createSpyObj('FB', ['login', 'logout', 'getLoginStatus', 'api']);
  FB.Event = jasmine.createSpyObj('FB.Event', ['subscribe']);

  describe('initializing the model', function() {

    describe('default options', function() {

      it('requires no special permissions by default', function() {
        expect(user.options.scope).toEqual([]);
      });

      it('turns autoFetch on by default', function() {
        expect(user.options.autoFetch).toBe(true);
      });

    });

    describe('passing options', function() {

      var user;

      beforeEach(function(){
        user = new FacebookUser(null, {
          autoFetch: false,
          scope: ['user_about_me'],
          other: 'foo'
        });
      });

      it('requires passed permissions', function() {
        expect(user.options.scope).toEqual(['user_about_me']);
      });

      it('turns autoFetch off', function() {
        expect(user.options.autoFetch).toBe(false);
      });

      it('sets custom options', function() {
        expect(user.options.other).toBe('foo');
      });

    });

    it('registers the model to the FB authResponseChange event', function(){
      expect(FB.Event.subscribe).toHaveBeenCalledWith('auth.authResponseChange', user.onLoginStatusChange);
    });

  });

  describe('#login', function() {

    afterEach(function(){
      FB.login.reset();
    });

    describe('with default permissions', function() {

      beforeEach(function() {
        user.login();
      });

      it('calls the FB.login method', function() {
        var options = { scope: '' };
        expect(FB.login).toHaveBeenCalledWith(jasmine.any(Function), options);
      });

    });

    describe('with custom permissions', function() {

      var user;

      beforeEach(function(){
        user = new FacebookUser(null, {
          scope: ['user_about_me']
        });

        user.login();
      });

      it('calls the FB.login method', function() {
        var options = { scope: 'user_about_me' };
        expect(FB.login).toHaveBeenCalledWith(jasmine.any(Function), options);
      });

    });

  });

  describe('#logout', function() {

    afterEach(function() {
      FB.logout.reset();
    });

    beforeEach(function() {
      user.logout();
    });

    it('calls the FB.logout method', function() {
      expect(FB.logout).toHaveBeenCalled();
    });

  });

  describe('#updateLoginStatus', function() {

    afterEach(function() {
      FB.getLoginStatus.reset();
    });

    beforeEach(function() {
      user.updateLoginStatus();
    });

    it('calls the FB.logout method', function() {
      expect(FB.getLoginStatus).toHaveBeenCalledWith(user.onLoginStatusChange);
    });

  });

  describe('#onLoginStatusChange', function() {

    var statusToEvent = {
      not_authorized: 'facebook:unauthorized',
      connected: 'facebook:connected',
      unknown: 'facebook:disconnected'
    };

    var cb = jasmine.createSpy('cb');

    afterEach(function() {
      cb.reset();
    });

    it('triggers the same event only once', function() {
      var response = { status: 'unknown' };
      user.bind('facebook:disconnected', cb);

      user.onLoginStatusChange(response);
      user.onLoginStatusChange(response);

      expect(cb.callCount).toEqual(1);
    });

    describe('unknown facebook status', function() {

      var response = { status: 'unknown' };
      var event = 'facebook:disconnected';

      it('triggers the ' + event + ' event', function() {
        user.bind(event, cb);
        user.onLoginStatusChange(response);
        expect(cb).toHaveBeenCalledWith(user, response);
      });

    });

    describe('connected to facebook', function() {

      var response = { status: 'connected' };
      var event = 'facebook:connected';

      it('triggers the ' + event + ' event', function() {
        user.bind(event, cb);
        user.onLoginStatusChange(response);
        expect(cb).toHaveBeenCalledWith(user, response);
      });

      it('automatically fetches the user profile', function() {
        spyOn(user, 'sync');
        user.onLoginStatusChange(response);
        expect(user.sync).toHaveBeenCalledWith('read', user, jasmine.any(Object));
      });

      it('does not fetch the user profile if turned off', function() {

        var user = new FacebookUser(null, {
          autoFetch: false
        });

        spyOn(user, 'sync');
        user.onLoginStatusChange(response);
        expect(user.sync).not.toHaveBeenCalled();
      });

    });

  });

  describe('#parse', function() {

    var response = { id: 1, other: 'ok' };

    it('returns the attributes of the response', function() {
      var parsed = user.parse(response);
      expect(parsed.id).toEqual(1);
      expect(parsed.other).toEqual('ok');
    });

    it('adds an object of profile pictures', function() {
      var parsed = user.parse(response);
      expect(parsed.pictures).toEqual(jasmine.any(Object));
    });

  });

  describe('#sync', function() {

    beforeEach(function() {

    });

    _(['create', 'update', 'delete']).each(function(method) {

      it('does not allow the ' + method + ' method', function() {
        var perform = function() {
          user.sync(method, user, {});
        };

        expect(perform).toThrow();
      });

    }, this);

    it('uses the FB api method', function() {
      user.sync('read', user, {});
      expect(FB.api).toHaveBeenCalledWith('/me', jasmine.any(Function));
      FB.api.reset();
    });

    describe('successful read', function() {

      it('triggers the success callback', function() {
        FB.api = jasmine.createSpy('FB.api').andCallFake(function(res, callback) {
          callback({ foo: 'bar' });
        });
        var cb = jasmine.createSpy('cb');

        user.sync('read', user, { success: cb });
        expect(cb.callCount).toBe(1);
      });

    });

    describe('unsuccessful read', function() {

      it('triggers the error callback', function() {
        FB.api = jasmine.createSpy('FB.api').andCallFake(function(res, callback) {
          callback({ error: 'noez!' });
        });
        var cb = jasmine.createSpy('cb');

        user.sync('read', user, { error: cb });
        expect(cb.callCount).toBe(1);
      });

    });

  });

  describe('#profilePictureUrls', function() {

    it('creates urls for all different picture sizes', function() {
      var pics = user.profilePictureUrls(1);
      expect(pics.square).toEqual(jasmine.any(String));
      expect(pics.small).toEqual(jasmine.any(String));
      expect(pics.normal).toEqual(jasmine.any(String));
      expect(pics.large).toEqual(jasmine.any(String));
    });

  });

  describe('#profilePictureUrl', function() {

    it('creates a url for the passed arguments', function() {
      var url = user.profilePictureUrl(1, 'small');
      expect(url).toBe('http://graph.facebook.com/1/picture?type=small');
    });

    it('respects a ssl protected site', function() {
      user.options.protocol = 'https:';
      var url = user.profilePictureUrl(1, 'small');
      expect(url).not.toBe('http://graph.facebook.com/1/picture?type=small');
    });

  });

});