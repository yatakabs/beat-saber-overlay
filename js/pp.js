//ŽQl:https://github.com/PulseLane/PPCounter/blob/master/PPCounter/Utilities/PPUtils.cs

// https://discord.com/channels/501624026532151296/506622896194715698/720108470657089606
// % on song, PP given
const curvePoints = [
    [1.14, 1.25],
    [1.1, 1.18],
    [1, 1.12],
    [0.95, 1.046],
    [0.945, 1.015],
    [0.88, 0.826],
    [0.84, 0.695],
    [0.8, 0.563],
    [0.7, 0.285],
    [0.68, 0.24],
    [0.65, 0.16],
    [0.6, 0.105],
    [0.55, 0.06],
    [0.5, 0.03],
    [0.45, 0.015],
    [0, 0]
];

const raw_pp_url = 'https://cdn.pulselane.dev/raw_pp.json';
var raw_pp = undefined;
//var raw_pp_list = null;
//var httpRequest = new XMLHttpRequest();

//httpRequest.onreadystatechange = function() {
//	if(this.readyState == 4 && this.status == 200) {
//		raw_pp_list = this.response;
//	}
//}
//httpRequest.open('GET', raw_pp_url, true);
//httpRequest.timeout = 5000;
//httpRequest.responseType = 'json';
//httpRequest.send(null);

function lerp(x0, y0, x1, y1, x) {
  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}

function song2pp(song) {
    if (song >= 1.14) return 1.25;
    if (song <= 0)    return 0;
    let i;
    for (i = 0; i < curvePoints.length; i++) {
        if (curvePoints[i][0] < song) break;
    }
    let lowSong   = curvePoints[i][0];
    let highSong  = curvePoints[i - 1][0];
    let lowGiven  = curvePoints[i][1];
    let highGiven = curvePoints[i - 1][1];
    return lerp(lowSong, lowGiven, highSong, highGiven, song);
}

function op_beatmap(data,now_map,pre_map) {
	raw_pp = undefined;
	let visibility = "visible";
	let difficulty = data.status.beatmap.difficulty;
	if (difficulty === "Expert+") difficulty = "ExpertPlus";
	let diff = `_${difficulty}_${data.status.game.mode}`;
	if (raw_pp_list !== null && data.status.beatmap.songHash.match(/^[0-9A-F]{40}/i)) {
		song_pp = raw_pp_list[data.status.beatmap.songHash.substr(0, 40)];
		if (song_pp !== undefined) {
			raw_pp = song_pp[diff];
		}
	}
	if (raw_pp === undefined) visibility = "hidden";
	var now_pp_group = document.getElementById("now_pp_group");
	now_pp_group.setAttribute("style", `visibility: ${visibility}`);
}

function op_performance(data,now_energy) {
	var now_pp = document.getElementById("now_pp");
	if (raw_pp !== undefined) {
		let performance = data.status.performance;
		let pp;
		if (performance.currentMaxScore > 0) {
			let song = performance.score / performance.currentMaxScore;
			pp = Math.floor((song2pp(song) * raw_pp) * 100) / 100;
		} else {
			pp = Math.floor((song2pp(1) * raw_pp) * 100) / 100;
		}
		now_pp.innerText =  pp;
	}
}
