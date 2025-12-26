import { UI_STATES } from './uiStates.js';

export function createUIStateMachine({ screens, hooks = {} }) {

    let currentState = UI_STATES.MENU;

    function hideAllScreens() {
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.visible = false;
            }
        });
    }

    function enterState(state) {
        hideAllScreens();

        if (hooks[state] && hooks[state].onEnter) {
            hooks[state].onEnter();
        }

        screens[state].visible = true;
        currentState = state;
    }

    function exitState(state) {
        if (hooks[state] && hooks[state].onExit) {
            hooks[state].onExit();
        }
    }

    let navigationLocked = false;

    function goTo(nextState) {
        if (navigationLocked) {
            return;
        }

        if (!screens[nextState] || nextState === currentState) {
            return;
        }

        const prevState = currentState;

        if (hooks[prevState] && hooks[prevState].onExit) {
            hooks[prevState].onExit(nextState);
        }

        hideAllScreens();

        if (hooks[nextState] && hooks[nextState].onEnter) {
            hooks[nextState].onEnter(prevState);
        }

        screens[nextState].visible = true;
        currentState = nextState;
    }


    function lockNavigation() {
        navigationLocked = true;
    }

    function unlockNavigation() {
        navigationLocked = false;
    }

    function getState() {
        return currentState;
    }

    function is(state) {
        return currentState === state;
    }

    return {
        goTo,
        getState,
        is,
        lockNavigation,
        unlockNavigation,
    };
}
