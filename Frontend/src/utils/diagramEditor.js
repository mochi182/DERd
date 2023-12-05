/**
 * Copyright (c) 2006-2020, JGraph Ltd
 * Copyright (c) 2006-2020, Gaudenz Alder
 *
 * Usage: DiagramEditor.editElement(elt) where elt is an img or object with
 * a data URI src or data attribute or an svg node with a content attribute.
 *
 * See https://jgraph.github.io/drawio-integration/javascript.html
 */

export class DiagramEditor {
	constructor(config, ui, done, initialized, urlParams)
	{
		this.config = (config != null) ? config : this.config;
		this.ui = (ui != null) ? ui : this.ui;
		this.done = (done != null) ? done : this.done;
		this.initialized = (initialized != null) ? initialized : this.initialized;
		this.urlParams = urlParams;

		var self = this;

		this.handleMessageEvent = this.handleMessageEvent.bind(this);
	};

	handleMessageEvent(evt) {
		if (
		  this.frame != null &&
		  evt.source == this.frame.contentWindow &&
		  evt.data.length > 0
		) {
		  try {
			var msg = JSON.parse(evt.data);
	
			if (msg != null) {
			  this.handleMessage(msg);
			}
		  } catch (e) {
			console.error(e);
		  }
		}
	  }

	/**
	 * Static method to edit the diagram in the given img or object.
	 */
	static editElement(elt, config, ui, done, urlParams)
	{
	if (!elt.diagramEditorStarting)
	{
		elt.diagramEditorStarting = true;

		return new DiagramEditor(config, ui, done, function()
		{
			delete elt.diagramEditorStarting;
		}, urlParams).editElementStart(elt);
	}
	};

	/**
	 * Global configuration.
	 */
	config = null;

	/**
	 * Protocol and domain to use.
	 */
	drawDomain = 'https://embed.diagrams.net/';

	/**
	 * UI theme to be use.
	 */
	ui = 'min';

	/**
	 * Contains XML for pending image export.
	 */
	xml = null;

	/**
	 * Format to use.
	 */
	format = 'xml';

	/**
	 * Specifies if libraries should be enabled.
	 */
	libraries = true;

	/**
	 * CSS style for the iframe.
	 */
	frameStyle = 'position:absolute;border:0;width:100%;height:100%;';

	/**
	 * Adds the iframe and starts editing.
	 */
	editElementStart(elem)
	{
		var src = this.getElementData(elem);
		this.startElement = elem;
		var fmt = this.format;

		if (src.substring(0, 15) === 'data:image/png;')
		{
			fmt = 'xmlpng';
		}
		else if (src.substring(0, 19) === 'data:image/svg+xml;' ||
			elem.nodeName.toLowerCase() == 'svg')
		{
			fmt = 'xmlsvg';
		}

		this.startEditing(src, fmt);

		return this;
	};

	/**
	 * Adds the iframe and starts editing.
	 */
	getElementData(elem)
	{
		var name = elem.nodeName.toLowerCase();

		return elem.getAttribute((name == 'svg') ? 'content' :
			((name == 'img') ? 'src' : 'data'));
	};

	/**
	 * Adds the iframe and starts editing.
	 */
	setElementData(elem, data)
	{
		var name = elem.nodeName.toLowerCase();

		if (name == 'svg')
		{
			elem.outerHTML = atob(data.substring(data.indexOf(',') + 1));
		}
		else
		{
			elem.setAttribute((name == 'img') ? 'src' : 'data', data);
		}

		return elem;
	};

	/**
	 * Starts the editor for the given data.
	 */
	startEditing(data, format, title)
	{
		if (this.frame == null)
		{
			window.addEventListener('message', this.handleMessageEvent);
			this.format = (format != null) ? format : this.format;
			this.title = (title != null) ? title : this.title;
			this.data = data;

			this.frame = this.createFrame(
				this.getFrameUrl(),
				this.getFrameStyle());
			document.body.appendChild(this.frame);
			this.setWaiting(true);
		}
	};

	/**
	 * Updates the waiting cursor.
	 */
	setWaiting(waiting)
	{
		if (this.startElement != null)
		{
			// Redirect cursor to parent for SVG and object
			var elt = this.startElement;
			var name = elt.nodeName.toLowerCase();

			if (name == 'svg' || name == 'object')
			{
				elt = elt.parentNode;
			}

			if (elt != null)
			{
				if (waiting)
				{
					this.frame.style.pointerEvents = 'none';
					this.previousCursor = elt.style.cursor;
					elt.style.cursor = 'wait';
				}
				else
				{
					elt.style.cursor = this.previousCursor;
					this.frame.style.pointerEvents = '';
				}
			}
		}
	};

	/**
	 * Updates the waiting cursor.
	 */
	setActive(active)
	{
		if (active)
		{
			this.previousOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
		}
		else
		{
			document.body.style.overflow = this.previousOverflow;
		}
	};

	/**
	 * Removes the iframe.
	 */
	stopEditing()
	{
		if (this.frame != null)
		{
			window.removeEventListener('message', this.handleMessageEvent);
			document.body.removeChild(this.frame);
			this.setActive(false);
			this.frame = null;
		}
	};

	/**
	 * Send the given message to the iframe.
	 */
	postMessage(msg)
	{
		if (this.frame != null)
		{
			this.frame.contentWindow.postMessage(JSON.stringify(msg), '*');
		}
	};

	/**
	 * Returns the diagram data.
	 */
	getData()
	{
		return this.data;
	};

	/**
	 * Returns the title for the editor.
	 */
	getTitle()
	{
		return this.title;
	};

	/**
	 * Returns the CSS style for the iframe.
	 */
	getFrameStyle()
	{
		return this.frameStyle + ';left:' +
			document.body.scrollLeft + 'px;top:' +
			document.body.scrollTop + 'px;';
	};

	/**
	 * Returns the URL for the iframe.
	 */
	getFrameUrl()
	{
		var url = this.drawDomain + '?proto=json&spin=1';

		if (this.ui != null)
		{
			url += '&ui=' + this.ui;
		}

		if (this.libraries != null)
		{
			url += '&libraries=1';
		}

		if (this.config != null)
		{
			url += '&configure=1';
		}

		if (this.urlParams != null)
		{
			url += '&' + this.urlParams.join('&');
		}

		return url;
	};

	/**
	 * Creates the iframe.
	 */
	createFrame(url, style)
	{
		var frame = document.createElement('iframe');
		frame.setAttribute('frameborder', '0');
		frame.setAttribute('style', style);
		frame.setAttribute('src', url);

		return frame;
	};

	/**
	 * Sets the status of the editor.
	 */
	setStatus(messageKey, modified)
	{
		this.postMessage({action: 'status', messageKey: messageKey, modified: modified});
	};

	/**
	 * Handles the given message.
	 */
	handleMessage(msg)
	{
		if (msg.event == 'configure')
		{
			this.configureEditor();
		}
		else if (msg.event == 'init')
		{
			this.initializeEditor();
		}
		else if (msg.event == 'autosave')
		{
			this.save(msg.xml, true, this.startElement);
		}
		else if (msg.event == 'export')
		{
		this.setElementData(this.startElement, msg.data);
			this.stopEditing();
		this.xml = null;
		}
		else if (msg.event == 'save')
		{
		this.save(msg.xml, false, this.startElement);
		this.xml = msg.xml;

			if (msg.exit)
			{
				msg.event = 'exit';
			}
		else
		{
		this.setStatus('allChangesSaved', false);
		}
		}

		if (msg.event == 'exit')
		{
			if (this.format != 'xml')
			{
		if (this.xml != null)
		{
				this.postMessage({action: 'export', format: this.format,
			xml: this.xml, spinKey: 'export'});
		}
		else
		{
			this.stopEditing(msg);
		}
			}
			else
			{
		if (msg.modified == null || msg.modified)
		{
				this.save(msg.xml, false, this.startElement);
		}

		this.stopEditing(msg);
			}
		}
	};

	/**
	 * Posts configure message to editor.
	 */
	configureEditor()
	{
		this.postMessage({action: 'configure', config: this.config});
	};

	/**
	 * Posts load message to editor.
	 */
	initializeEditor()
	{
		this.postMessage({action: 'load',autosave: 1, saveAndExit: '1',
			modified: 'unsavedChanges', xml: this.getData(),
			title: this.getTitle()});
		this.setWaiting(false);
		this.setActive(true);
	this.initialized();
	};

	/**
	 * Saves the given data.
	 */
	save(data, draft, elt)
	{
		this.done(data, draft, elt);
	};

	/**
	 * Invoked after save.
	 */
	done()
	{
		// hook for subclassers
	};

	/**
	 * Invoked after the editor has sent the init message.
	 */
	initialized()
	{
		// hook for subclassers
	};

}