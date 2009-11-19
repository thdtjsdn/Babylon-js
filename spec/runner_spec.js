Screw.Unit(function() {
  describe("Babylon.Runner", function() {
    var runner = {};
    var router = {};
    var observer = {};

    before(function(){
      router = new Babylon.Router();
      observer = new Babylon.Observer();
      runner = new Babylon.Runner(router, observer);
    });

    describe("init", function() {
      it("should set the observer and router", function() {
        expect(runner.router).to_not(equal, null);
        expect(runner.router).to_not(equal, undefined);

        expect(runner.observer).to_not(equal, null);
        expect(runner.observer).to_not(equal, undefined);
      });
    });

    describe("run", function() {
      var host = "";
      var jid = "";
      var config = {};

      before(function(){
        host = "hth.com";
        jid = "student@hth.com";
        config = {"host": host, "jid": jid};
        runner.run(config);
      });
      
      it("should set the config", function() {
        expect(Babylon.config).to(equal, config);
      });

      it("should intialize the connection", function() {
        expect(Babylon.Runner.connection).to_not(equal, null);
        expect(Babylon.Runner.connection).to_not(equal, undefined);
        expect(Babylon.Runner.connection.host).to(equal, host);
      });

      it("should call connect on the connection", function() {
        expect(Babylon.Runner.connection.jid).to(equal, jid);
      });
    });
    
    describe("run with reattach", function() {
      
      it("should call reattach when a cookie exists and attach option passed", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.expects("read_cookie").returns({jid: "jid", sid: "sid", rid: "rid"});
        Babylon.Connection.prototype.expects("reattach");
        runner.run({"host": "hth.com", "jid": "student@hth.com", "attach": true});
        expect(Babylon.Connection.prototype).to(verify_to, true);
      });
      
      it("should not call reattach when a cookie exists but attach option not passed", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.expects("read_cookie").returns({jid: "jid", sid: "sid", rid: "rid"});
        Babylon.Connection.prototype.expects("reattach").never();
        runner.run({"host": "hth.com", "jid": "student@hth.com"});
        expect(Babylon.Connection.prototype).to(verify_to, true);
      });
      
      it("should not call reattach when a cookie does not exists and attach option passed", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.expects("read_cookie").returns("");
        Babylon.Connection.prototype.expects("reattach").never();
        runner.run({"host": "hth.com", "jid": "student@hth.com"});
        expect(Babylon.Connection.prototype).to(verify_to, true);
      });
      
      it("should call the strophe attach method passing the data from the cookie", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        var mock = new Mock(Strophe.Connection.prototype);
        
        Babylon.Connection.prototype.expects("read_cookie").twice().returns({jid: "jid", sid: "sid", rid: "rid"});
        Strophe.Connection.prototype.expects("attach").passing("jid", "sid", "rid", Babylon.Connection.prototype.on_connect);
        
        runner.run({ "host": "hth.com", "jid": "student@hth.com", "attach": true });
        
        expect(Babylon.Connection.prototype).to(verify_to, true);
        expect(Strophe.Connection.prototype).to(verify_to, true);
      });
    });
  });
});
