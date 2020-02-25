// https://gist.github.com/paulirish/1579671
/* eslint-disable no-restricted-globals */
let lastTime = 0;
const vendors = ['ms', 'moz', 'webkit', 'o'];
let _requestAnimationFrame = window.requestAnimationFrame;
let _cancelAnimationFrame = window.cancelAnimationFrame;

for (let x = 0; x < vendors.length && !_requestAnimationFrame; ++x) {
  _requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
  _cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] || window[`${vendors[x]}CancelRequestAnimationFrame`];
}

if (!_requestAnimationFrame) {
  _requestAnimationFrame = function(callback) {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;

    return id;
  };
}

if (!_cancelAnimationFrame) {
  _cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

/**
 * Polyfill for requestAnimationFrame.
 *
 * @param {Function} callback The function to call when it's time.
 * @returns {number}
 */
export function requestAnimationFrame(callback) {
  return _requestAnimationFrame.call(window, callback);
}

/**
 * @returns {boolean}
 */
export function isClassListSupported() {
  return !!document.documentElement.classList;
}

/**
 * @returns {boolean}
 */
export function isTextContentSupported() {
  return !!document.createTextNode('test').textContent;
}

/**
 * @returns {boolean}
 */
export function isGetComputedStyleSupported() {
  return !!window.getComputedStyle;
}
/**
 * Polyfill for cancelAnimationFrame.
 *
 * @param {number} id The request Id, generated by `requestAnimationFrame`.
 */
export function cancelAnimationFrame(id) {
  _cancelAnimationFrame.call(window, id);
}

/**
 * @returns {boolean}
 */
export function isTouchSupported() {
  return ('ontouchstart' in window);
}

let _hasCaptionProblem;

/**
 *
 */
function detectCaptionProblem() {
  const TABLE = document.createElement('TABLE');
  TABLE.style.borderSpacing = '0';
  TABLE.style.borderWidth = '0';
  TABLE.style.padding = '0';
  const TBODY = document.createElement('TBODY');
  TABLE.appendChild(TBODY);
  TBODY.appendChild(document.createElement('TR'));
  TBODY.firstChild.appendChild(document.createElement('TD'));
  TBODY.firstChild.firstChild.innerHTML = '<tr><td>t<br>t</td></tr>';

  const CAPTION = document.createElement('CAPTION');
  CAPTION.innerHTML = 'c<br>c<br>c<br>c';
  CAPTION.style.padding = '0';
  CAPTION.style.margin = '0';
  TABLE.insertBefore(CAPTION, TBODY);

  document.body.appendChild(TABLE);
  _hasCaptionProblem = (TABLE.offsetHeight < 2 * TABLE.lastChild.offsetHeight); // boolean
  document.body.removeChild(TABLE);
}

/**
 * @returns {boolean}
 */
export function hasCaptionProblem() {
  if (_hasCaptionProblem === void 0) {
    detectCaptionProblem();
  }

  return _hasCaptionProblem;
}

let comparisonFunction;

/**
 * Get string comparison function for sorting purposes. It supports multilingual string comparison base on Internationalization API.
 *
 * @param {string} [language] The language code used for phrases sorting.
 * @param {object} [options] Additional options for sort comparator.
 * @returns {*}
 */
export function getComparisonFunction(language, options = {}) {
  if (comparisonFunction) {
    return comparisonFunction;
  }

  if (typeof Intl === 'object') {
    comparisonFunction = new Intl.Collator(language, options).compare;

  } else if (typeof String.prototype.localeCompare === 'function') {
    comparisonFunction = (a, b) => (`${a}`).localeCompare(b);

  } else {
    comparisonFunction = (a, b) => {
      if (a === b) {
        return 0;
      }

      return a > b ? -1 : 1;
    };
  }

  return comparisonFunction;
}

let passiveSupported;
/**
 * Checks if browser supports passive events.
 *
 * @returns {boolean}
 */
export function isPassiveEventSupported() {
  if (passiveSupported !== void 0) {
    return passiveSupported;
  }

  try {
    const options = {
      get passive() {
        passiveSupported = true;
      }
    };

    // eslint-disable-next-line no-restricted-globals
    window.addEventListener('test', options, options);
    // eslint-disable-next-line no-restricted-globals
    window.removeEventListener('test', options, options);
  } catch (err) {
    passiveSupported = false;
  }

  return passiveSupported;
}
