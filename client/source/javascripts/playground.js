var Room = Room || {};

(function($, SimpleEvent){
	"use strict";


	// root.World = function() {
	// 	var socket;

	// 	this.init = function() {
	// 		socket = io.connect(host);
	// 		callbackSetup();
	// 	};

	// 	function callbackSetup() {
	// 		socket.on("ready", function(e) {
	// 			if (isHost) {
	// 				console.log("created");
	// 				$("*").hover(function(e){
	// 					socket.emit("mouse hover",)
	// 				})
	// 			} else {
	// 				console.log("joined");
	// 			}

	// 			$("body").mousemove(function(e){
	// 				socket.emit("mouse move", getPos(e))
	// 			});


	// 		});

	// 		socket.on("mouse update", function(e) {
	// 			$("#debug").text(e.x + ": " + e.y);
	// 			$("#mouse").css("left", e.x);
	// 			$("#mouse").css("top", e.y);

	// 			target = document.elementFromPoint(e.x, e.y);
	// 			console.log(target);
	// 		});

	// 		socket.on("error", function(e) {
	// 			console.log(e.message);
	// 		});
	// 	};

	// 	return this;
	// };




}(jQuery, SimpleEvent));
