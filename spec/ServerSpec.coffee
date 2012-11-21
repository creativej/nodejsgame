server = require('../server/app.js');
World = server.World;
AssignVisitor = server.AssignVisitor;
Playgrounds = server.Playgrounds;
Playground = server.Playground;
User = server.User;

describe "Server", =>
	user = null

	beforeEach =>
		user = {
			'hash': 'ABCD'
		}

	describe "World", =>
		describe "onConnection", =>
			it "should identify visitor", =>
				user = {
					'hash': 'ABCD'
				}

				socket = {
					on: (name, callback) ->
						callback(user)
				}

				spyOn(World, 'assignVisitor')
				World.onConnection socket
				expect(World.assignVisitor).toHaveBeenCalledWith socket, user

	describe "AssignVistor", =>
		socket = {
			on: (name, callback) ->
			emit: (name, data) ->
		}

		describe "run", =>
			it "should setup some sockets", =>
				spyOn(socket, 'on')
				new AssignVisitor(socket, user).execute()
				expect(socket.on.argsForCall[0][0]).toEqual 'create'
				expect(socket.on.argsForCall[1][0]).toEqual 'join'

		describe "create", =>
			afterEach =>
				World.playgrounds.reset()

			it "should be an error informing there is already a playground with the same name", =>
				spyOn(socket, 'emit')
				spyOn(World.playgrounds, 'get').andReturn { name: 'test'}
				cmd = new AssignVisitor socket, user
				cmd.create('test', 'password')

				expect(socket.emit.argsForCall[0][0]).toEqual 'isVisitor'
				expect(socket.emit.argsForCall[1][0]).toEqual 'error'

			it "should create a new playground", =>
				console.log('new. ::');
				spyOn(socket, 'emit')
			
				cmd = new AssignVisitor socket, user
				expect(World.playgrounds.length()).toEqual 0
				cmd.create('test', 'password')
				expect(World.playgrounds.length()).toEqual 1

				expect(socket.emit.argsForCall[0][0]).toEqual 'isVisitor'
				expect(socket.emit.argsForCall[socket.emit.argsForCall.length - 1][0]).toEqual 'created'

		describe "join", =>
			afterEach =>
				World.playgrounds.reset()
			it "should be an error informing that there is no such playground", =>
				spyOn(socket, 'emit')
				cmd = new AssignVisitor socket, user
				cmd.join('test', 'password')
				expect(socket.emit.argsForCall[0][0]).toEqual 'isVisitor'
				expect(socket.emit.argsForCall[1][0]).toEqual 'error'
			it "should join a playground", =>
				spyOn(socket, 'emit')
				cmd = new AssignVisitor socket, user
				cmd.create('test', 'password')
				cmd.join('test', 'password')
				expect(socket.emit.argsForCall[0][0]).toEqual 'isVisitor'
				expect(socket.emit.argsForCall[socket.emit.argsForCall.length - 1][0]).toEqual 'joined'

	describe "playgrounds", =>
		afterEach =>
			Playgrounds.reset()
		it "should add item to playgrounds", =>
			Playgrounds.add { name: 'test'}
			expect(Playgrounds.data.length).toEqual 1

		it "should reset playgrounds", =>
			Playgrounds.add { name: 'test'}
			Playgrounds.reset()
			expect(Playgrounds.data.length).toEqual 0

		it "should get an item off playground", =>
			testItem = { name: 'test'}
			Playgrounds.add testItem
			item = Playgrounds.get('test')
			expect(item).toEqual testItem

		it "should get an item off playground", =>
			testItem = { name: 'test'}
			Playgrounds.add testItem
			item = Playgrounds.get('test2')
			expect(item).toEqual null

	describe "playground", =>
		socket = {
			on: (name, callback) ->
			emit: (name, data) ->
		}

		afterEach =>
			World.playgrounds.reset()

		it "should construct playground", =>
			playground = new Playground("test")
			expect(playground.name).toEqual "test"

		it "should add host to playground", =>
			playground = new Playground("test")

			expect(playground.users.length).toEqual 0
			expect(playground.host).toEqual null
			playground.addUser(socket, true)
			expect(typeof playground.host).toEqual "object"
			expect(playground.users.length).toEqual 1


		it "should add client to playground", =>
			playground = new Playground("test")

			playground.addUser(socket, false)
			expect(playground.host).toEqual null
			expect(playground.users.length).toEqual 1

		it "should trigger broadcast change event", =>
			playground = new Playground("test")
			playground.addUser(socket, user, true)
			spyOn(playground, "broadcastEvent")
			playground.host.update("mouse", {})

			expect(playground.broadcastEvent).toHaveBeenCalledWith user.hash, "mouse", {}

		it "should broadcast change event", =>
			playground = new Playground("test")
			user = new User(socket, true)

			playground.users = [user]

			spyOn(user, "socketEmit")

			for user in playground.users
				playground.broadcastEvent(user.hash, 'mouse', {})
				expect(user.socketEmit).toHaveBeenCalledWith user.hash, 'mouse', {}

	describe "User", =>
		socket = {
			on: (name, callback) ->
			emit: (name, data) ->
		}

		it "should construct host user", =>
			newuser = new User(socket, user, true)
			expect(newuser.isHost).toEqual true
			expect(newuser.socket).toEqual socket
			expect(newuser.data).toEqual user

		it "should construct client user", =>
			newuser = new User(socket, user, false)
			expect(newuser.isHost).toEqual false

		it "should init", =>
			user = new User(socket, user, true)
			spyOn(socket, 'on')
			user.init()
			expect(user.isHost).toEqual true
			expect(socket.on.argsForCall[0][0]).toEqual 'mouse move'

		it "should update", =>
			user = new User(socket, user, true)
			spyOn(user, 'emit')
			user.update('mouse', {})
			expect(user.data.mouse).toEqual {}
			expect(user.emit).toHaveBeenCalled()

		it "should update", =>
			user = new User(socket, user, true)
			spyOn(socket, 'emit')
			user.socketEmit('mouse', {})
			expect(socket.emit).toHaveBeenCalled()


		it "should get value", =>
			user = new User(socket, user, true);
			
			expect(user.get('hash')).toEqual 'ABCD';

		it "should set value", =>
			user = new User(socket, user, true);
			user.set('hash', 'test');

			expect(user.get('hash')).toEqual 'test';
