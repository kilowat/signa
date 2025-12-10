const contextStack = [];

export function createHooksContext() {
    return {
        cleanups: [],
        currentPhase: null
    };
}

export function pushContext(context, phase) {
    context.currentPhase = phase;
    contextStack.push(context);
}

export function popContext() {
    if (contextStack.length === 0) {
        console.warn('Attempting to pop empty context stack');
        return;
    }
    const context = contextStack.pop();
    if (context) {
        context.currentPhase = null;
    }
}
