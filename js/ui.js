const ui = (() => {
	if (html_id["overlay"]) var main = document.getElementById("overlay");
	var now_map = null;
	var pre_map = null;
	var pre_songHash = null;
	var now_energy = 50;
	var mod_instaFail = false;
	var mod_batteryEnergy = false;
	var obstacle_time = 0;
	var failed = false;

	const performance = (() => {
		const cut_energy = 1;
		const misscut_energy = -10;
		const miss_energy = -15;
		const drain_energy = -0.13;  //per msec
		const battery_unit = 25;
		if (html_id["rank"])       var rank = document.getElementById("rank");
		if (html_id["percentage"]) var percentage = document.getElementById("percentage");
		if (html_id["score"])      var score = document.getElementById("score");
		if (html_id["combo"])      var combo = document.getElementById("combo");
		if (html_id["miss"])       var miss = document.getElementById("miss");
		if (html_id["energy"])     var energy = document.getElementById("energy");
		if (html_id["energy_bar"]) var energy_bar = document.getElementById("energy_bar");
		if (html_id["energy_group"])  var energy_group = document.getElementById("energy_group");

		function format(number) {
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		return (data) => {
			var performance = data.status.performance;
			if (html_id["score"]) score.innerText = format(performance.score);
			if (html_id["combo"]) combo.innerText = performance.combo;
			if (html_id["rank"])  rank.innerText = performance.rank;
			if (html_id["miss"])  miss.innerText = performance.missedNotes;
			if (html_id["percentage"]) {
				percentage.innerText = (performance.currentMaxScore > 0 ? (Math.floor((performance.score / performance.currentMaxScore) * 1000) / 10) : 100) + "%";
			}
			if (typeof performance.softFailed !== "undefined") {
				if (performance.softFailed === true) {
					now_energy = null;
					if (html_id["energy"]) energy.innerText = "NF";
					if (html_id["energy_group"]) energy_group.setAttribute("style", "visibility: hidden");
				}
			}
			if (now_energy !== null) {
				if (typeof performance.energy !== "undefined") {
					if (data.event === "energyChanged") {
						now_energy = performance.energy * 100;
					}
				} else {
					if (data.event === "obstacleEnter") {
						obstacle_time = data.time;
					}
					if (mod_instaFail === false && mod_batteryEnergy === false) {
						switch(data.event) {
							case "noteCut":
								now_energy += cut_energy;
								break;
							case "noteMissed":
								if (data.noteCut.saberType == null) {
									now_energy += miss_energy;
								} else {
									now_energy += misscut_energy;
								}
								break;
							case "bombCut":
								now_energy += miss_energy;
								break;
							case "obstacleExit":
								var delta_t = data.time - obstacle_time;
								now_energy += delta_t * drain_energy;
								break;
						}
					} else {
						switch(data.event) {
							case "noteMissed":
							case "bombCut":
								if (mod_instaFail === true) {
									now_energy = 0;
								} else {
									now_energy -= battery_unit;
								}
								break;
							case "obstacleExit":
								if (mod_instaFail === true) {
									now_energy = 0;
								} else {
									var delta_t = data.time - obstacle_time;
									now_energy += parseInt(delta_t * drain_energy) * battery_unit;
								}
								break;
						}
					}
				}
				if (now_energy > 100) now_energy = 100;
				if (data.event === "failed") {
					now_energy = 0;
					failed = true;
				}
				if (now_energy < 0) now_energy = 0;
				if (failed) now_energy = 0;
				if (html_id["energy"]) energy.innerText = Math.round(now_energy) + "%";
				if (html_id["energy_bar"]) energy_bar.setAttribute("style", `width: ${Math.round(now_energy)}%`);
			}
			
			if (typeof op_performance !== "undefined") op_performance(data,now_energy);
		}
	})();

	const timer = (() => {
		const radius = 30;
		const circumference = radius * Math.PI * 2;

		if (html_id["progress"])      var bar = document.getElementById("progress");
		if (html_id["song_time"])     var song_time = document.getElementById("song_time");

		var active = false;

		var began;
		var duration;
		var length_min;
		var length_sec;

		var display;

		function format(time) {
			var minutes = Math.floor(time / 60);
			var seconds = time % 60;

			if (seconds < 10) {
				seconds = "0" + seconds;
			}

			return `${minutes}:${seconds}`;
		}

		function update(time) {
			time = time || Date.now();

			var delta = time - began;

			var progress = Math.floor(delta / 1000);
			var percentage = Math.min(delta / duration, 1);

			if (html_id["progress"]) bar.setAttribute("style", `stroke-dashoffset: ${(1 - percentage) * circumference}px`);
			if (typeof op_timer_update !== "undefined") op_timer_update(time, delta, progress, percentage);

			// Minor optimization
			if (progress != display) {
				display = progress;
				if (html_id["song_time"]) song_time.innerText = format(progress);
				if (typeof op_timer_update_sec !== "undefined") op_timer_update_sec(time, delta, progress, percentage);
			}
		}

		function loop() {
			if (active) {
				update();
				requestAnimationFrame(loop);
			}
		}

		return {
			start(time, length) {
				active = true;
				
				began = time;
				duration = length;

				length_min = Math.floor(duration / 1000 / 60);
				length_sec = Math.floor(duration / 1000) % 60;
				if (length_sec < 10) {
					length_sec = "0" + length_sec;
				}
				if (html_id["song_length"]) song_length.innerText = `${length_min}:${length_sec}`;

				loop();
			},

			pause(time) {
				active = false;

				update(time);
			},

			stop() {
				active = false;
				began = undefined;
				duration = undefined;
			}
		}
	})();

	const beatmap = (() => {
		const beatsaver_url = 'https://beatsaver.com/api/maps/by-hash/';
		const request_timeout = 5000; //msec
		if (html_id["image"])         var cover = document.getElementById("image");

		if (html_id["title"])         var title = document.getElementById("title");
		if (html_id["subtitle"])      var subtitle = document.getElementById("subtitle");
		if (html_id["artist"])        var artist = document.getElementById("artist");
		if (html_id["mapper_header"]) var mapper_header = document.getElementById("mapper_header");
		if (html_id["mapper"])        var mapper = document.getElementById("mapper");
		if (html_id["mapper_footer"]) var mapper_footer = document.getElementById("mapper_footer");

		if (html_id["difficulty"])    var difficulty = document.getElementById("difficulty");
		if (html_id["bpm"])           var bpm = document.getElementById("bpm");
		if (html_id["njs"])           var njs = document.getElementById("njs");
		if (html_id["njs_text"])      var njs_text = document.getElementById("njs_text");
		if (html_id["bsr"])           var bsr = document.getElementById("bsr");
		if (html_id["bsr_text"])      var bsr_text = document.getElementById("bsr_text");
		if (html_id["mod"])           var mod = document.getElementById("mod");
		if (html_id["pre_bsr"])       var pre_bsr = document.getElementById("pre_bsr");
		if (html_id["pre_bsr_text"])  var pre_bsr_text = document.getElementById("pre_bsr_text");
		if (html_id["energy"])        var energy = document.getElementById("energy");
		if (html_id["energy_group"])  var energy_group = document.getElementById("energy_group");
		var httpRequest = new XMLHttpRequest();
		
		function format(number) {
			if (Number.isNaN(number)) {
				return "NaN";
			}

			if (Math.floor(number) !== number) {
				return number.toFixed(2);
			}

			return number.toString();
		}

		return (data) => {
			var beatmap = data.status.beatmap;
			var performance = data.status.performance;
			var time = data.time;
			var mod_data = data.status.mod;
			var visibility = "visible";
			failed = false;
			mod_instaFail = mod_data.instaFail;
			mod_batteryEnergy = mod_data.batteryEnergy;
			if (mod_data.noFail === true && (typeof performance.softFailed === "undefined")) {
				now_energy = null;
				visibility = "hidden";
				if (html_id["energy"]) energy.innerText = "NF";
			} else {
				if (mod_instaFail === false && mod_batteryEnergy === false) {
					now_energy = 50;
				} else {
					now_energy = 100;
				}
			}
			if (html_id["energy_group"]) energy_group.setAttribute("style", `visibility: ${visibility}`);
			if (beatmap.difficulty === "ExpertPlus") {
				beatmap.difficulty = "Expert+";
			}

			if (html_id["image"])    cover.setAttribute("src", `data:image/png;base64,${beatmap.songCover}`);

			if (html_id["title"])    title.innerText = beatmap.songName;
			if (html_id["subtitle"]) subtitle.innerText = beatmap.songSubName;
			if (html_id["bsr"])      bsr.innerText = '';
			if (html_id["bsr_text"]) bsr_text.innerText = '';
			
			httpRequest.onreadystatechange = function() {
				if(this.readyState == 4 && this.status == 200) {
					now_map = this.response;
					if (now_map !== null) {
						if (html_id["bsr"])      bsr.innerText = now_map.key;
						if (html_id["bsr_text"]) bsr_text.innerText = bsr_text_org;
					}
					if (typeof op_beatsaver_res !== "undefined") op_beatsaver_res(now_map);
				}
			}
			
			if (pre_songHash === beatmap.songHash) {
				if (bsr_display && now_map !== null) {
					if (html_id["bsr"])      bsr.innerText = now_map.key;
					if (html_id["bsr_text"]) bsr_text.innerText = bsr_text_org;
				}
			} else {
				pre_songHash = beatmap.songHash;
				pre_map = now_map;
				now_map = null;
				if (bsr_display && beatmap.songHash !== null && beatmap.songHash.match(/^[0-9A-F]{40}/i)) {
					httpRequest.open('GET', beatsaver_url + beatmap.songHash.substr(0, 40), true);
					httpRequest.timeout = request_timeout;
					httpRequest.responseType = 'json';
					httpRequest.send(null);
				}
			}
			
			if (html_id["artist"]) artist.innerText = beatmap.songAuthorName;
			if (beatmap.levelAuthorName) {
				if (html_id["mapper_header"]) mapper_header.innerText = mapper_header_org;
				if (html_id["mapper"])        mapper.innerText = beatmap.levelAuthorName;
				if (html_id["mapper_footer"]) mapper_footer.innerText = mapper_footer_org;
			} else {
				if (html_id["mapper_header"]) mapper_header.innerText = "";
				if (html_id["mapper"])        mapper.innerText = "";
				if (html_id["mapper_footer"]) mapper_footer.innerText = "";
			}

			if (html_id["difficulty"]) difficulty.innerText = beatmap.difficulty;
			if (html_id["bpm"]) bpm.innerText = format(beatmap.songBPM);

			if (beatmap.noteJumpSpeed) {
				if (html_id["njs"]) njs.innerText = format(beatmap.noteJumpSpeed);
				if (html_id["njs_text"]) njs_text.innerText = njs_text_org;
			} else {
				if (html_id["njs"]) njs.innerText = "";
				if (html_id["njs_text"]) njs_text.innerText = "";
			}
			
			if (html_id["mod"]) {
				var mod_text = "";
				if (mod_data.instaFail === true)          mod_text += "IF,";
				if (mod_data.batteryEnergy === true)      mod_text += "BE,";
				if (mod_data.disappearingArrows === true) mod_text += "DA,";
				if (mod_data.ghostNotes === true)         mod_text += "GN,";
				if (mod_data.songSpeed === "Faster")      mod_text += "FS,";
				if (mod_data.songSpeed === "Slower")      mod_text += "SS,";
				if (mod_data.noFail === true)             mod_text += "NF,";
				if (mod_data.obstacles === false)         mod_text += "NO,";
				if (mod_data.noBombs === true)            mod_text += "NB,";
				if (mod_data.noArrows === true)           mod_text += "NA,";
				mod_text = mod_text.slice(0,-1);
				mod.innerText = mod_text;
			}
			
			if (pre_bsr_data === null) {
				if (html_id["pre_bsr"])      pre_bsr.innerText = "";
				if (html_id["pre_bsr_text"]) pre_bsr_text.innerText = "";
			} else {
				if (html_id["pre_bsr"])      pre_bsr.innerText = pre_map.key;
				if (html_id["pre_bsr_text"]) pre_bsr_text.innerText = pre_bsr_text_org;
			}

			timer.start(Date.now(), beatmap.length);
			if (typeof op_beatmap !== "undefined") op_beatmap(data,now_map,pre_map);
		}
	})();

	return {
		hide() {
			if (html_id["overlay"]) main.classList.add("hidden");
			if (typeof op_hide !== "undefined") op_hide();
		},

		show() {
			if (html_id["overlay"]) main.classList.remove("hidden");
			if (typeof op_show !== "undefined") op_show();
		},

		performance,
		timer,
		beatmap
	}
})();
