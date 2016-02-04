(function () {
	'use strict';

	var Workout = {

		init: function () {

			this.$container = $('.container');
			this.$workout = this.$container.find('.workout');
			this.$template = Handlebars.compile($('#workout-tmpl').html());

			this.generatedWorkouts = [];

			this.getData().done(function (res) {
				this.cacheData(res);
				this.generateRandomWorkout();
			}.bind(this));

			this.bindEvents();
		},

		getData: function () {
			return $.getJSON('data/wods.json');
		},

		bindEvents: function () {
			this.$container.find('.generate-workout-btn')
				.off('click')
				.on('click', function (e) {
					e.preventDefault();
					this.generateRandomWorkout();
				}.bind(this));
		},

		cacheData: function (data) {
			this.workoutList = data;
		},

		generateRandomWorkout: function () {
			var index = Math.floor(Math.random() * this.workoutList.length);

			// check if it's already been generated...
			if (this.generatedWorkouts.indexOf(index) > -1) {

				// if every workout has been generated, clear
				if (this.generatedWorkouts.length === this.workoutList.length) {
					this.generatedWorkouts = [];
				}

				// get a new workout
				this.generateRandomWorkout();
			} else {

				// render the workout
				this.$workout.html(this.$template(this.workoutList[index]));
				this.generatedWorkouts.push(index);
			}
		}
	};

	Workout.init();
})();
