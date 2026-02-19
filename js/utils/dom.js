/**
 * Helpers DOM
 */

/**
 * Query selector shorthand
 * @param {string} selector 
 * @param {Element} context 
 * @returns {Element|null}
 */
export function qs(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector 
 * @param {Element} context 
 * @returns {NodeList}
 */
export function qsa(selector, context = document) {
    return context.querySelectorAll(selector);
}

/**
 * Crée un élément DOM avec options
 * @param {string} tag 
 * @param {Object} options 
 * @returns {Element}
 */
export function createElement(tag, options = {}) {
    const el = document.createElement(tag);
    
    if (options.className) el.className = options.className;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    if (options.attrs) {
        Object.entries(options.attrs).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
    }
    if (options.events) {
        Object.entries(options.events).forEach(([event, handler]) => {
            el.addEventListener(event, handler);
        });
    }
    if (options.children) {
        options.children.forEach(child => el.appendChild(child));
    }
    
    return el;
}

/**
 * Crée un élément de stat avec badge
 * @param {string} badgeClass 
 * @param {string} badgeText 
 * @param {number} value 
 * @returns {DocumentFragment}
 */
export function createStatWithBadge(badgeClass, badgeText, value) {
    const fragment = document.createDocumentFragment();
    
    const badge = createElement('span', {
        className: `badge ${badgeClass}`,
        text: badgeText
    });
    
    fragment.appendChild(badge);
    fragment.appendChild(document.createTextNode(`: ${value}`));
    
    return fragment;
}
