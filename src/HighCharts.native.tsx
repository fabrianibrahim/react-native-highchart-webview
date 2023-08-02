import React from 'react';
import * as Highcharts from 'highcharts';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import useBuildHighChartsHTML from './hooks/useBuildHighChartsHTML.native';

interface HighChartsProps  {
    options: Highcharts.Options;
    children?: React.ReactNode;
    messageCallback?(event: WebViewMessageEvent): void;
}

const HighCharts: React.FunctionComponent<HighChartsProps> = ({ options, children, messageCallback }) => {
    const sourceHtml = useBuildHighChartsHTML({
        ...options
    });

    return (
        <>
            <WebView
                testID="highcharts-webview"
                originWhitelist={['*']}
                source={{ html: sourceHtml }}
                javaScriptEnabled={true}
                onMessage={messageCallback}
            />
            {children && children}
        </>
    );
};

export default HighCharts;
