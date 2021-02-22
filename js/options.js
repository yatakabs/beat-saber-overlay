const query = new URLSearchParams(location.search);
var bsr_display = false;
var disp_hidden = true;
var energy_display = false;
var rtl_display = false;
var pre_bsr_data = null;
const check_id = ["overlay","rank","percentage","combo","score","progress","energy_area",
                  "image","title","subtitle","artist","difficulty","bpm","njs","bsr","bsr_text",
                  "mapper","mapper_header","mapper_footer","song_time","song_length","mod","miss",
                  "pre_bsr","pre_bsr_text","njs_text","energy","energy_bar","energy_group",
                  "now_pp","now_pp_text","star","star_text","pp","pp_text","label_header",
                  "label_footer","label","subtitle_group","title_group","titles","bsr-group","meta",
                  "beatmap","cover_group","artist_group","artist_group","text","title_subtitle",
									"artist_mapper_group","map_info","map_info_group","difficulty_group",
									"difficulty_label","artist_mapper"]
var html_id = {};
for (var i = 0, len = check_id.length; i < len; ++i) {
	if (document.getElementById(check_id[i]) === null) {
		html_id[check_id[i]] = false;
	} else {
		html_id[check_id[i]] = true;
	}
}
if (html_id["mapper_header"]) var mapper_header_org = document.getElementById("mapper_header").textContent;
if (html_id["mapper_footer"]) var mapper_footer_org = document.getElementById("mapper_footer").textContent;
if (html_id["bsr_text"])      var bsr_text_org      = document.getElementById("bsr_text").textContent;
if (html_id["pre_bsr_text"])  var pre_bsr_text_org  = document.getElementById("pre_bsr_text").textContent;
if (html_id["njs_text"])      var njs_text_org      = document.getElementById("njs_text").textContent;
if (html_id["now_pp_text"])   var now_pp_text_org   = document.getElementById("now_pp_text").textContent;
if (html_id["star_text"])     var star_text_org     = document.getElementById("star_text").textContent;
if (html_id["pp_text"])       var pp_text_org       = document.getElementById("pp_text").textContent;
if (html_id["label_header"])  var label_header_org  = document.getElementById("label_header").textContent;
if (html_id["label_footer"])  var label_footer_org  = document.getElementById("label_footer").textContent;

(() => {
	const handlers = {
		modifiers(string) {
			string.split(",").forEach((modifier) => {
				if (modifier === "no-hidden") {
					disp_hidden = false;
					if (html_id["overlay"]) document.getElementById("overlay").classList.remove("hidden");
					return;
				}
				if (modifier === "bsr" || modifier === "all") {
					bsr_display = true;
				}
				if (modifier === "energy" || modifier === "all") {
					energy_display = true;
				}
				if (modifier === "rtl") {
					rtl_display = true;
				}
				var link = document.createElement("link");
				
				link.setAttribute("rel", "stylesheet");
				link.setAttribute("href", `./modifiers/${modifier}.css`);
		
				document.head.appendChild(link);
			});
		}
	};

	Object.keys(handlers).forEach((key) => {
		var value = query.get(key);

		if (value) {
			handlers[key](value);
		}
	});
	
	if (location.hash) {
		// Legacy URL hash support
		handlers.modifiers(location.hash.slice(1));
	}
	
})();