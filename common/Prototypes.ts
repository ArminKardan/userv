
if (typeof String.prototype.between === 'undefined') {
    Object.defineProperty(String.prototype, 'between', {
        value: function (startStr, endStr) {
            const startIndex = this.indexOf(startStr) + startStr.length;
            const endIndex = this.indexOf(endStr, startIndex);
            if (startIndex === -1 || endIndex === -1) {
                return null; // اگر یکی از رشته‌ها پیدا نشد، null برگردان
            }
            return this.slice(startIndex, endIndex);
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

if (typeof Array.prototype.includesid === 'undefined') {

    Object.defineProperty(Array.prototype, 'includesid', {
        value: function (objid) {
            if (!objid) {
                return false
            }
            return !!this.find(obj => obj.equals(objid))
        }
    });
}

if (typeof Array.prototype.toggle === 'undefined') {
    Object.defineProperty(Array.prototype, 'toggle', {
        value: function (el) {
            const index = this.indexOf(el); // پیدا کردن ایندکس المان
            if (index !== -1) {
                this.splice(index, 1); // اگر المان وجود داشت، آن را حذف کن
            } else {
                this.push(el); // اگر المان وجود نداشت، آن را اضافه کن
            }
            return this; // آرایه‌ی تغییر یافته را برگردان
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}


