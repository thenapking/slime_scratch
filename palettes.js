let colours = []

var mixChoices = ['srgb', 'oklab', 'lab', 'oklch', 'lch', 'okhsl', 'hsl', 'lab-d65', 'p3' ]
var mixChoice = 'lch'
var directions = [null, 'increasing', 'decreasing']
var direction = "increasing"

var oneColor = "#4375db", twoColor = "#B4B0C4", threeColor = "#CC9395", fourColor = "#EF611B", fiveColor = "#ED0707";


let palettes = {
  "mindful117": {
    colours: ["#F8F4ED", "#E0D6C8", "#EB7B07", "#677F70", "#181B26", "#060609"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful106A": {
    colours: ["#F6F3E7", "#E7D5C5", "#FFBB55", "#C44E4F", "#143C5D", "#011C89"],
    mixChoice: "oklab",
    direction: "increasing"
  },
  "mindful106": {
    colours: ["#F6F3E7", "#E7D5C5", "#FFBB55", "#C44E4F", "#143C5D", "#011C39"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful122": {
    colours: ["#F7FCFE", "#F4BF77", "#007A53", "#004C6A", "#00334F"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful33": {
    colours: ["#F2EEE2", "#D9E4DE", "#FFD700", "#F3BC00", "#4A6558", "#2B4B40"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful86": {
    colours: ["#F5E9CE", "#FFA102", "#DD5533", "#BC2029", "#450E15", "#432E6F"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful91": {
    colours: ["#F2F3F4", "#C8CBCD", "#1C70AD", "#004683", "#E5756A"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful153": {
    colours: ["#F8F4ED", "#C6D6D7", "#F8E462", "#E35C38", "#2A4B5F", "#001B2E"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful156": {
    colours: ["#E2D5C2", "#F4A384", "#486D83", "#7A5063", "#4A2C3F"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful157": {
    colours: ["#F6F4F1", "#CED2AB", "#155D66", "#5C2C45", "#CB5C5B"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful159": {
    colours: ["#FEDCC3", "#9FBBC3", "#811D45", "#323477", "#161E34"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "mindful68": {
    colours: ["#FAEADD", "#FBCF4F", "#F29CB7", "#DDAAFF", "#522A6F", "#222023"],
    mixChoice: "srgb",
    direction: "increasing"
  },
  "blue-red": {
    colours: ["#4375db", "#B4B0C4", "#CC9395", "#EF611B", "#ED0707"],
    mixChoice: "lch",
    direction: null
  },
  "1970s": {
    colours: ["#F51905", "#FFE380", "#F584CC", "#3A67DA", "#1F5128"],
    mixChoice: "lch",
    direction: null
  },
  "1970s-TWO": {
    colours: ["#F5cc00", "#F08928", "#EEA5CB", "#778FEE", "#265443"],
    mixChoice: "lch",
    direction: null
  },
  "1970s-THREE": {
    colours: ["#000C29", "#3DB1FF", "#F1A2CA", "#F4C623", "#FB2D28"],
    mixChoice: "lch",
    direction: null
  },
  "CALYPSO": {
    colours: ["#FF1500", "#F5781C", "#F0C800", "A2FA1E", "#255728"],
    mixChoice: "lch",
    direction: null
  },
  "CERULEAN THISTLE": {
    colours: ["#0690F9", "#D170D7", "#D53934", "#36533D", "#121935"],
    mixChoice: "lch",
    direction: null
  },
  "PRIMARY": {
    colours: ["#E9371C", "#3480EA", "#4194C8", "#66A171", "#F8C61B"],
    mixChoice: "lch",
    direction: null
  },
  "GLOWING": {
    colours: ["#191923", "#15578a", "#BE2770", "#EE4744", "#f4b943"],
    mixChoice: "lch",
    direction: null
  },
  "EARTHRISE": {
    colours: ["#061927", "#2779EC", "#61FFC8", "#EF935A", "#B11812"],
    mixChoice: "lch",
    direction: null
  },
  "PURPLE PATCH": {
    colours: ["#142542", "#EE7264", "#ECB718", "#880D23", "#6E071A"],
    mixChoice: "lch",
    direction: null
  },
  "UP ONLY": {
    colours: ["#E63357", "#210128", "#0E26A0", "#436E71", "#F1a145"],
    mixChoice: "lch",
    direction: null
  },
  "FOREST": {
    colours: ["#2D4E38", "#6C7F72", "#75877B", "#FB9E79", "#304570"],
    mixChoice: "lch",
    direction: null
  },
  "JUPITER": {
    colours: ["#000000", "#000000", "#14142d", "#ff6417", "#eec584"],
    mixChoice: "lch",
    direction: null
  },
  "PROG ROCK": {
    colours: ["#3aa7a7", "#708d81", "#98090c", "#a50104", "#fcba04"],
    mixChoice: "lch",
    direction: null
  },
  "PURPLE BRUISE": {
    colours: ["#390040", "#390040", "#073d50", "#2448e1", "#f08700"],
    mixChoice: "lch",
    direction: null
  },
  "TANGO": {
    colours: ["#4375db", "#b4b0c4", "#cc9395", "#ef611b", "#2f4b26"],
    mixChoice: "lch",
    direction: null
  },
  "DC": {
    colours: ["#f0bf74", "#ffa108", "#e3676e", "#1b5299", "#273c1f"],
    mixChoice: "lch",
    direction: null
  },
  "RACING GREY AND NEON": {
    colours: ["#13293d", "#13293d", "#d53934", "#103718", "#0d280d"],
    mixChoice: "lch",
    direction: null
  },
  "BRIGHT": {
    colours: ["#e81a20", "#ffbc06", "#fcb900", "#ff99c3", "#2159ed"],
    mixChoice: "lch",
    direction: null
  },
  "OEHM RAINBOW": {
    colours: ["#ff2000", "#ffd801", "#41aa52", "#00539c", "#012355"],
    mixChoice: "lch",
    direction: null
  },
  "LICORICE AUBURN CERULEAN": {
    colours: ["#c4d6b0", "#4c9fd4", "#409cd7", "#c52424", "#070101"],
    mixChoice: "lch",
    direction: null
  },
  "BOY GIRL": {
    colours: ["#f58fb7", "#ed7ca8", "#2f67b1", "#12288a", "#12288a"],
    mixChoice: "lch",
    direction: null
  },
  "HIROSHIMA SUNRISE": {
    colours: ["#003387", "#0d508e", "#ed9e28", "#ed9e28", "#190935"],
    mixChoice: "lch",
    direction: null
  },
};

var palette_name = "mindful106"
var palette_names = Object.keys(palettes)
let palette = palettes[palette_name]
let colours_length = 1

function calculate_colours(){
  let de = 0.0001
  let config = {space: palette.mixChoice, hue: palette.direction, maxDeltaE: de}
  let steps = [];
  palette.colours.push("#000000")

  for (let i = 0; i < palette.colours.length - 1; i++) {
    let rngi = Color.range(palette.colours[i], palette.colours[i+1], config)
    let stepsi = Color.steps(rngi, config)
    steps = steps.concat(stepsi)
  }


  colours = steps.map(c => c.toString({format: "hex", space: "srgb"}))
  colours_length = colours.length

  premap_colours();
}


let mapped_colours = [];
function premap_colours(){
  for(let i=255; i>=0; i--){
    let c = Math.floor(map(i, 0, 255, 0, colours_length - 1));
    let col = colours[c];
    let r = red(col) || 0;
    let g = green(col) || 0;
    let b = blue(col) || 0;
    mapped_colours.push(r / 255.0)
    mapped_colours.push(g / 255.0)
    mapped_colours.push(b / 255.0)
  }
}

function map(val, in_min, in_max, out_min, out_max) {
  return out_min + ((val - in_min) * (out_max - out_min)) / (in_max - in_min);
}

function red(hex) {
  if (hex[0] === "#") hex = hex.slice(1);
  return parseInt(hex.slice(0, 2), 16);
}

function green(hex) {
  if (hex[0] === "#") hex = hex.slice(1);
  return parseInt(hex.slice(2, 4), 16);
}

function blue(hex) {
  if (hex[0] === "#") hex = hex.slice(1);
  return parseInt(hex.slice(4, 6), 16);
}

