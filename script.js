(function () {
	'use strict';

	var _this;

	var Helpers = {

		generateDate: function (date) {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);

			return date.toDateString();
		}
	};

	var WOD = {

		init: function () {

			// cache object reference
			_this = this;

			// cache DOM elements
			_this.$container = $('#main-container');
			_this.$workout = $('#wod-container');
			_this.$template = Handlebars.compile($('#workout-tmpl').html());

			// get WOD data
			_this.wodData = JSON.parse(localStorage.getItem('wod_data'));

			if (_this.wodData) {
				_this.getCurrentWOD();
				return;
			}

			_this.getWODData().done(function (res) {
				_this.cacheWODData(res);
				_this.getCurrentWOD();
			});
		},

		getWODData: function () {
			return $.getJSON('data/wods.json');
		},

		cacheWODData: function (res) {
			localStorage.setItem('wod_data', JSON.stringify(res));
			_this.wodData = res;
		},

		getCurrentWOD: function () {
			_this.currentWOD = JSON.parse(localStorage.getItem('current_wod'));
			_this.generateRandomWOD();
		},

		generateRandomWOD: function (override) {

			if (override || !_this.currentWOD || _this.isWODStale()) {
				_this.currentWOD = Math.floor(Math.random() * _this.wodData.length);
				localStorage.setItem('current_wod', _this.currentWOD);
			}

			_this.renderWOD();
		},

		isWODStale: function () {
			var date = Helpers.generateDate(new Date());
			var wod = _this.wodData[_this.currentWOD];

			if (wod.updated_date && (date === wod.updated_date)) {
				return false;
			}

			return true;
		},

		renderWOD: function () {
			var wod = _this.wodData[_this.currentWOD];

			wod.updated_date = Helpers.generateDate(new Date());

			// store updated data
			localStorage.setItem('current_wod', _this.currentWOD);
			localStorage.setItem('wod_data', JSON.stringify(_this.wodData));

			// render WOD
			_this.$workout.html(_this.$template(wod));
			_this.positionContainer();

			// bind DOM event(s)
			$('#random-btn', _this.$container)
				.off('click')
				.on('click', function () {
					_this.generateRandomWOD(true);
				});
		},

		positionContainer: function () {
			var width = '-' + Math.floor(_this.$container.outerWidth() / 2) + 'px';
			var height = '-' + Math.floor(_this.$container.outerHeight() / 2) + 'px';

      _this.$container.css('margin-top', height).css('margin-left', width);
		}
	};

	WOD.init();
})();
