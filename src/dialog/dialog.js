var Dialog = /** @class */ (function () {
    function Dialog(parentElement) {
        var _this = this;
        this.parentElement = parentElement;
        this.box = document.createElement('div');
        this.dialog = document.createElement('div');
        var header = document.createElement('div');
        this.title = document.createElement('div');
        this.close = document.createElement('span');
        this.close.innerHTML = "\n      <svg fill=\"none\" viewBox=\"0 0 16 16\" width=\"1em\" height=\"1em\">\n      <path\n        fill=\"currentColor\"\n        d=\"M8 8.92L11.08 12l.92-.92L8.92 8 12 4.92 11.08 4 8 7.08 4.92 4 4 4.92 7.08 8 4 11.08l.92.92L8 8.92z\"\n        fill-opacity=\"0.9\"\n      ></path>\n    </svg>";
        var body = document.createElement('div');
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('frameborder', '0');
        this.box.className = 'meta2d-dialog_mask';
        this.dialog.className = 'meta2d-dialog';
        body.className = 'meta2d-dialog_body';
        header.className = 'meta2d-dialog_header';
        this.title.className = 'meta2d-dialog-content';
        this.close.className = 'meta2d-dialog-close';
        header.appendChild(this.title);
        header.appendChild(this.close);
        body.appendChild(this.iframe);
        this.dialog.appendChild(header);
        this.dialog.appendChild(body);
        this.box.appendChild(this.dialog);
        parentElement.appendChild(this.box);
        this.dialog.onclick = function (e) {
            e.stopPropagation();
        };
        this.box.onclick = function () {
            _this.hide();
        };
        this.close.onclick = function () {
            _this.hide();
        };
        var sheet;
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].title === 'le5le.com/dialog') {
                sheet = document.styleSheets[i];
            }
        }
        if (!sheet) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.title = 'le5le.com/dialog';
            document.head.appendChild(style);
            style = document.createElement('style');
            style.type = 'text/css';
            document.head.appendChild(style);
            sheet = style.sheet;
            sheet.insertRule(".meta2d-dialog_mask {\n        display: none;\n        position: absolute;\n        top: 0%;\n        left: 0%;\n        width: 100%;\n        height: 100%;\n        background-color: #0000006f;\n        z-index: 9999;");
            sheet.insertRule(".meta2d-dialog_mask .meta2d-dialog {\n            position: absolute;\n            top: 15vh;\n            left: 10%;\n            width: 80%;\n            padding: 16px 20px;\n            border-radius: 9px;\n            background-color: #1e2430;\n            z-index: 19999;\n            overflow: auto;\n        }");
            sheet.insertRule(".meta2d-dialog_header {\n            display: flex;\n        }");
            sheet.insertRule(".meta2d-dialog-content {\n            width: calc(100% - 20px);\n            font-weight: 600;\n            font-size: 14px;\n            color: #bdc7db;\n        }");
            sheet.insertRule(".meta2d-dialog-close {\n            width: 20px;\n            height: 20px;\n            line-height: 20px;\n            text-align: center;\n            color: #617b91;\n        }");
            sheet.insertRule(".meta2d-dialog-close :hover{\n            cursor: pointer;\n        }");
            sheet.insertRule(".meta2d-dialog_body{\n            margin-top: 4px;\n        } ");
            sheet.insertRule(".meta2d-dialog_body iframe{\n            width: 100%;\n            height: 400px;\n        }");
        }
    }
    Dialog.prototype.show = function (title, url) {
        this.box.style.display = 'block';
        url && this.iframe.setAttribute('src', url);
        title && (this.title.innerText = title);
    };
    Dialog.prototype.hide = function () {
        this.box.style.display = 'none';
    };
    Dialog.prototype.destroy = function () {
        this.dialog.onclick = undefined;
        this.box.onclick = undefined;
        this.close.onclick = undefined;
    };
    return Dialog;
}());
export { Dialog };
//# sourceMappingURL=dialog.js.map