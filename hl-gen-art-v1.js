/**
 * Highlight Generative Art Script : V1
 * @version: v1
 * @description The script exposes certain values and methods that
 * can be used within code based generative art.
 */

let searchParams = new URLSearchParams(window.location.search);

const generateRandomHash = () => {
  const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  return (
    "0x" +
    Array(40)
      .fill(0)
      .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
      .join("")
  );
};

const generateRandomAddress = () => {
  const alphabet = "0123456789abcdef";
  return (
    "0x" +
    Array(40)
      .fill(0)
      .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
      .join("")
  );
};

function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19));
  return function () {
    (h = Math.imul(h ^ (h >>> 16), 2246822507)),
      (h = Math.imul(h ^ (h >>> 13), 3266489909));
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32New(a, b, c, d) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    var t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

const address = searchParams.get("a") || generateRandomAddress();
const chainId = searchParams.get("c") || [1,5,137,80001][Math.floor(Math.random()*4)];
const hash = searchParams.get("h") || generateRandomHash();
const blockHash = searchParams.get("bh") || generateRandomHash();
const tokenId = searchParams.get("tid") || Math.floor(100 * Math.random()).toString();
const walletAddress = searchParams.get("wa") || generateRandomAddress();
const timestamp = searchParams.get("t") || Date.now();
const seed = xmur3(hash + tokenId);

const hl = {
  tx: {
    address,
    chainId,
    hash,
    blockHash,
    timestamp,
    walletAddress,
    tokenId,
  },
  random: sfc32New(seed(), seed(), seed(), seed()),
  randomNum: (min, max) => {
    return min + (max - min) * hl.random();
  },
  randomInt: (min, max) => {
    return Math.floor(hl.randomNum(min, max + 1));
  },
  randomBool: (p) => {
    return hl.random() < p;
  },
  randomElement: (array) => {
    return array[hl.randomInt(0, array.length - 1)];
  },
  token: {
    id: searchParams.get("tid"),
    attributes: {},
    capturePreview: function () {
      window.dispatchEvent(new Event("CAPTURE_PREVIEW"));
      setTimeout(() => this.capturePreview(), 500);
    },
    setAttributes: function (attributes) {
      this.attributes = attributes;
    },
    getAttributes: function () {
      return this.attributes;
    },
  },
  context: {
    previewMode: searchParams.get("pr") === "1",
  },
};

window.$hl = hl;