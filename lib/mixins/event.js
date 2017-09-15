'use babel';

export default {
    on(eventName, fn) {
        this.getHandlers(eventName).push(fn);
    },
    getHandlers(eventName) {
        this.handlers = this.handlers || {};
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        return this.handlers[eventName];
    },
    emit(eventName, data) {
        this.getHandlers(eventName)
            .forEach((handler) => {
                handler(data);
            });
    },
};
