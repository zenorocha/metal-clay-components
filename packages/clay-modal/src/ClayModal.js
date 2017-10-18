import 'clay-button';
import 'clay-icon';
import Component from 'metal-component';
import {EventHandler} from 'metal-events';
import Soy from 'metal-soy';
import {Config} from 'metal-state';
import dom from 'metal-dom';

import templates from './ClayModal.soy.js';

const KEY_CODE_ESC = 27;

/**
 * Metal ClayModal component.
 */
class ClayModal extends Component {
  /**
   * @inheritDoc
   */
  created() {
    this._overlayElement = this._valueOverlayElementFn();
    this._eventHandler = new EventHandler();
  }

  /**
   * @inheritDoc
   */
  attached() {
    this.addListener('hide', this._defaultHideModal, true);
    this.addListener('click', this._handleDocumentClick.bind(this), true);
    this.addListener('touchend', this._handleDocumentClick.bind(this), true);
  }

  /**
   * Close modal and remove transitions.
   * @private
   */
  _defaultHideModal() {
    this._isTransitioning = false;
    dom.removeClasses(this._overlayElement, 'show');
    dom.removeClasses(document.body, 'modal-open');

    setTimeout(() => {
      this.visible = false;
    }, 100);

    this._eventHandler.removeAllListeners();
  }

  /**
   * Check if contain click target event in element and emit close modal.
   * @private
   */
  _handleDocumentClick() {
    if (dom.contains(event.target, this.element)) this.emit('hide');
  }

  /**
   * Handle the click and emit close modal.
   * @private
   */
  _handleCloseModal() {
    this.emit('hide');
  }

  /**
   * Handle the click buttons and emit event.
   * @private
   */
  _handleClickButtonFooter() {
    this.emit('clickButton');
  }

  /**
   * Open modal and add transition.
   * @public
   */
  show() {
    dom.addClasses(document.body, 'modal-open');
    this.visible = true;

    setTimeout(() => {
      this._isTransitioning = true;
      dom.addClasses(this._overlayElement, 'show');
    }, 5);

    this._eventHandler.add(
      dom.on(document, 'keyup', this._handleKeyup.bind(this))
    );
  }

  /**
   * Handle click key code esc and emit close modal.
   * @param {Object} event
   * @private
   */
  _handleKeyup(event) {
    if (event.keyCode === KEY_CODE_ESC) this.emit('hide');
  }

  /**
   * @inheritDoc
   */
  syncVisible() {
    let willShowOverlay = this.visible;
    dom[willShowOverlay ? 'enterDocument' : 'exitDocument'](
      this._overlayElement
    );
  }

  /**
   * Create fragment of the overlay modal.
   * @return {Element} The resulting document fragment.
   * @private
   */
  _valueOverlayElementFn() {
    return dom.buildFragment('<div class="modal-backdrop fade"></div>')
      .firstChild;
  }

  /**
   * @inheritDoc
   */
  detached() {
    super.detached();
    this._eventHandler.removeAllListeners();
  }
}

/**
 * State definition.
 * @static
 * @type {!Object}
 */
ClayModal.STATE = {
  /**
   * Body of the modal.
   * @instance
   * @memberof ClayModal
   * @type {?string|html|undefined}
   * @default undefined
   */
  body: Config.any(),

  /**
   * Buttons of the footer.
   * @instance
   * @memberof ClayModal
   * @type {?array|undefined}
   * @default undefined
   */
  footer: Config.arrayOf(
    Config.shapeOf({
      label: Config.string().required(),
      style: Config.oneOf(['primary', 'secondary']).value('primary'),
      type: Config.oneOf(['save', 'close']),
    })
  ),

  /**
   * Id to be applied to the element.
   * @instance
   * @memberof ClayModal
   * @type {?string|undefined}
   * @default undefined
   */
  id: Config.string(),

  /**
   * Active use of the iframe in body.
   * @instance
   * @memberof ClayModal
   * @type {?bool}
   * @default false
   */
  iframe: Config.bool().value(false),

  /**
   * Adds transitions when show is called.
   * @instance
   * @memberof ClayModal
   * @type {?bool}
   * @default false
   * @private
   */
  _isTransitioning: Config.bool()
    .value(false)
    .internal(),

  /**
   * The size of element modal.
   * @instance
   * @memberof ClayModal
   * @type {?string|undefined}
   * @default undefined
   */
  size: Config.oneOf(['full-screen', 'lg', 'sm']),

  /**
   * The path to the SVG spritemap file containing the icons.
   * @instance
   * @memberof ClayModal
   * @type {?string|undefined}
   * @default undefined
   */
  spritemap: Config.string(),

  /**
   * Status messages.
   * @instance
   * @memberof ClayModal
   * @type {?string|undefined}
   * @default undefined
   */
  status: Config.oneOf(['danger', 'info', 'success', 'warning']),

  /**
   * Title of the modal.
   * @instance
   * @memberof ClayModal
   * @type {?string|undefined}
   * @default undefined
   */
  title: Config.string(),

  /**
   * Modal visible when show is called.
   * @instance
   * @memberof ClayModal
   * @type {?bool}
   * @default false
   * @private
   */
  visible: Config.bool()
    .value(false)
    .internal(),
};

Soy.register(ClayModal, templates);

export {ClayModal};
export default ClayModal;