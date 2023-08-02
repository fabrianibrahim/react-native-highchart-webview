export interface CustomWindow extends Window {
    ReactNativeWebView: {
        postMessage: (message: string) => void;
    };
}