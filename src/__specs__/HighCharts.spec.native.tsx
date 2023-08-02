import React from 'react';
import HighCharts, {HighChartsOptions} from '../HighCharts.native';
import { WebViewMessageEvent } from 'react-native-webview';
import {Text} from 'react-native';
import {act, fireEvent, render} from "@testing-library/react-native";
import {CustomWindow} from "../Interfaces";

declare const window: CustomWindow;

describe('HighCharts Native', () => {
    it('should render HighCharts inside a webview', () => {
        const lineData = {
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            exporting: {
                enabled: false
            },
            series: [
                {
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }
            ]
        };
        const { getByTestId } = render(<HighCharts options={lineData as HighChartsOptions} />);
        const webView = getByTestId('highcharts-webview');
        expect(webView).toBeTruthy();
        expect(webView.props.javaScriptEnabled).toBe(true);
    });

    it('should render HighCharts with children', () => {
        const barData = {
            chart: {
                type: 'bar'
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [
                {
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }
            ]
        };
        const { getByTestId } = render(
            <HighCharts options={barData as HighChartsOptions}>
                <Text testID="children">More info</Text>
            </HighCharts>
        );
        expect(getByTestId('children')).toBeTruthy();
    });

    it('should render HighCharts with messageCallback', () => {
        const lineData = {
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar']
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (): void {
                                const message = JSON.stringify({ type: 'pointClick', data: { name: this.category, y: this.y } });
                                window.ReactNativeWebView.postMessage(message);
                            }
                        }
                    }
                }
            },
            series: [
                {
                    data: [29.9, 71.5, 106.4]
                }
            ]
        };
        const messageCallback = jest.fn();
        const handleMessage = (event: WebViewMessageEvent): void => {
            try {
                const messageData = JSON.parse(event.nativeEvent.data);
                if (messageData.type === 'pointClick') {
                    messageCallback();
                }
            } catch (error) {
                console.error(error);
            }
        };
        const { getByTestId } = render(
            <HighCharts options={lineData as unknown as HighChartsOptions} messageCallback={handleMessage} />
        );
        const webView = getByTestId('highcharts-webview');
        expect(webView).toBeTruthy();
        act(() => {
            fireEvent(webView, 'onMessage', { nativeEvent: { data: '{"type": "pointClick"}' } });
        });
        expect(messageCallback).toHaveBeenCalledTimes(1);
    });
});
