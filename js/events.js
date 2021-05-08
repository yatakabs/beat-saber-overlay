const events = {
	hello(data) {
		console.log("Connected to Beat Saber");

		if (data.status.beatmap && data.status.performance) {
			ui.beatmap(data);
			ui.performance(data);
			ui.show();
		}
		ex_hello.forEach(ex => ex(data));
	},

	songStart(data) {
		ui.beatmap(data);
		ui.performance(data);
		ui.show();
		ex_songStart.forEach(ex => ex(data));
	},

	noteCut(data) {
		ui.performance(data);
		ex_noteCut.forEach(ex => ex(data));
	},

	noteFullyCut(data) {
		ui.performance(data);
		ex_noteFullyCut.forEach(ex => ex(data));
	},

	obstacleEnter(data) {
		ui.performance(data);
		ex_obstacleEnter.forEach(ex => ex(data));
	},

	obstacleExit(data) {
		ui.performance(data);
		ex_obstacleExit.forEach(ex => ex(data));
	},

	noteMissed(data) {
		ui.performance(data);
		ex_noteMissed.forEach(ex => ex(data));
	},

	bombCut(data) {
		ui.performance(data);
		ex_bombCut.forEach(ex => ex(data));
	},

	finished(data) {
		ui.performance(data);
		ex_finished.forEach(ex => ex(data));
	},

	failed(data) {
		ui.performance(data);
		ex_failed.forEach(ex => ex(data));
	},

	softFailed(data) {
		ui.performance(data);
		ex_softFailed.forEach(ex => ex(data));
	},

	scoreChanged(data) {
		ui.performance(data);
		ex_scoreChanged.forEach(ex => ex(data));
	},

	energyChanged(data) {
		ui.performance(data);
		ex_energyChanged.forEach(ex => ex(data));
	},

	pause(data) {
		ui.timer.pause(data.status.beatmap.paused + (Date.now() - data.time));
		ex_pause.forEach(ex => ex(data));
	},

	resume(data) {
		ui.timer.start(data.status.beatmap.start + (Date.now() - data.time), data.status.beatmap.length, false);
		ex_resume.forEach(ex => ex(data));
	},

	menu(data) {
		ui.timer.stop();
		if (disp_hidden) {
			ui.hide();
		}
		ex_menu.forEach(ex => ex(data));
	}
}