const fs = require('fs');
const vm = require('vm');

function makeElement(sourceRef) {
  return {
    dataset: {},
    attrs: {},
    listeners: {},
    textContent: '',
    currentTime: 10,
    paused: true,
    classList: {
      _set: new Set(),
      add(name) { this._set.add(name); },
      remove(name) { this._set.delete(name); },
      contains(name) { return this._set.has(name); },
    },
    querySelector(selector) { return selector === 'source' ? sourceRef : null; },
    querySelectorAll() { return []; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    removeEventListener() {},
    setAttribute(name, value) { this.attrs[name] = String(value); },
    getAttribute(name) { return this.attrs[name] || ''; },
    removeAttribute(name) { delete this.attrs[name]; },
    closest() { return null; },
    focus() {},
    load() { this.loadCalls = (this.loadCalls || 0) + 1; },
    play() { this.playCalls = (this.playCalls || 0) + 1; this.paused = false; return Promise.resolve(); },
    pause() { this.pauseCalls = (this.pauseCalls || 0) + 1; this.paused = true; },
  };
}

function runScenario(playlistValue) {
  const source = makeElement(null);
  const video = makeElement(source);
  video.dataset.playlist = playlistValue;
  video.dataset.titles = '["Demo"]';

  const elements = {
    'explore-video-btn': makeElement(null),
    'video-modal': makeElement(null),
    'video-close': makeElement(null),
    'video-next': makeElement(null),
    'platform-video': video,
    'video-title': makeElement(null),
    'video-counter': makeElement(null),
    'video-status': makeElement(null),
  };

  const documentStub = {
    readyState: 'loading',
    domQueriesBeforeReady: 0,
    domContentLoaded: null,
    querySelectorAll() { this.domQueriesBeforeReady += 1; return []; },
    querySelector() { return null; },
    getElementById(id) { return elements[id] || null; },
    addEventListener(type, callback) {
      if (type === 'DOMContentLoaded') {
        this.domContentLoaded = callback;
      }
    },
    removeEventListener() {},
  };

  const context = { document: documentStub, console };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);

  if (documentStub.domQueriesBeforeReady !== 0) {
    throw new Error('DOM was queried before DOMContentLoaded.');
  }

  documentStub.domContentLoaded();
  elements['explore-video-btn'].listeners.click();

  return { source, video, elements };
}

const known = runScenario('["movie.mp4"]');
if (known.source.attrs.type !== 'video/mp4') {
  throw new Error(`Expected mp4 MIME type, got: ${known.source.attrs.type || '<unset>'}`);
}
if (known.video.loadCalls !== 1 || known.video.playCalls !== 1) {
  throw new Error('Known source did not load and play as expected.');
}

const unknown = runScenario('["movie.unknownext"]');
if ('type' in unknown.source.attrs) {
  throw new Error('Unknown MIME type should remove the type attribute.');
}
if (!unknown.elements['video-modal'].classList.contains('open')) {
  throw new Error('Video modal did not open on click.');
}

console.log('video-overlay tests passed');
