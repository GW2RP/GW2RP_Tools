import React, { Component } from 'react';

class Loader extends Component {
    render() {
        const { type, fill, size } = this.props;

        switch (type) {
            case "grid":
                return (
                    <svg width={size || 60} height={size || 60} viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" fill={fill || "#000"}>
                        <circle cx="12.5" cy="12.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="0s" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="12.5" cy="52.5" r="12.5" fillOpacity=".5">
                            <animate attributeName="fill-opacity"
                                begin="100ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="52.5" cy="12.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="300ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="52.5" cy="52.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="600ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="92.5" cy="12.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="800ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="92.5" cy="52.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="400ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="12.5" cy="92.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="700ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="52.5" cy="92.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="500ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="92.5" cy="92.5" r="12.5">
                            <animate attributeName="fill-opacity"
                                begin="200ms" dur="1s"
                                values="1;.2;1" calcMode="linear"
                                repeatCount="indefinite" />
                        </circle>
                    </svg>

                )
            default:
                return (
                    <svg width="100px" height="100px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-blank">
                        <circle cx="50" cy="50" fill="none" r="47" stroke="#ee3301" strokeWidth="6">
                            <animate attributeName="stroke-dasharray" calcMode="linear" values="0 0 0 147.6548547187203 0 147.6548547187203;0 0 147.6548547187203 0 0 147.6548547187203;0 0 147.6548547187203 0 0 147.6548547187203;0 147.6548547187203 0 147.6548547187203 0 147.6548547187203;0 147.6548547187203 0 147.6548547187203 0 147.6548547187203" keyTimes="0;0.2;0.4;0.6;1" dur="4.7" begin="-4.7s" repeatCount="indefinite">
                            </animate>
                        </circle>
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#ee6624" strokeWidth="6">
                            <animate attributeName="stroke-dasharray" calcMode="linear" values="0 0 0 125.66370614359172 0 125.66370614359172;0 0 125.66370614359172 0 0 125.66370614359172;0 0 125.66370614359172 0 0 125.66370614359172;0 125.66370614359172 0 125.66370614359172 0 125.66370614359172;0 125.66370614359172 0 125.66370614359172 0 125.66370614359172" keyTimes="0;0.2;0.4;0.6;1" dur="4.7" begin="-4.324s" repeatCount="indefinite">
                            </animate>
                        </circle>
                        <circle cx="50" cy="50" fill="none" r="33" stroke="#bb4410" strokeWidth="6">
                            <animate attributeName="stroke-dasharray" calcMode="linear" values="0 0 0 103.67255756846318 0 103.67255756846318;0 0 103.67255756846318 0 0 103.67255756846318;0 0 103.67255756846318 0 0 103.67255756846318;0 103.67255756846318 0 103.67255756846318 0 103.67255756846318;0 103.67255756846318 0 103.67255756846318 0 103.67255756846318" keyTimes="0;0.2;0.4;0.6;1" dur="4.7" begin="-3.9480000000000004s" repeatCount="indefinite">
                            </animate>
                        </circle>
                        <g transform="rotate(180 50 50)">
                            <circle cx="50" cy="50" fill="none" r="47" stroke="#ee3301" strokeWidth="6">
                                <animate attributeName="stroke-dasharray" calcMode="linear" values="0 0 0 147.6548547187203 0 147.6548547187203;0 0 147.6548547187203 0 0 147.6548547187203;0 0 147.6548547187203 0 0 147.6548547187203;0 147.6548547187203 0 147.6548547187203 0 147.6548547187203;0 147.6548547187203 0 147.6548547187203 0 147.6548547187203" keyTimes="0;0.2;0.4;0.6;1" dur="4.7" begin="-2.0679999999999996s" repeatCount="indefinite">
                                </animate>
                            </circle>
                            <circle cx="50" cy="50" fill="none" r="40" stroke="#ee6624" strokeWidth="6">
                                <animate attributeName="stroke-dasharray" calcMode="linear" values="0 0 0 125.66370614359172 0 125.66370614359172;0 0 125.66370614359172 0 0 125.66370614359172;0 0 125.66370614359172 0 0 125.66370614359172;0 125.66370614359172 0 125.66370614359172 0 125.66370614359172;0 125.66370614359172 0 125.66370614359172 0 125.66370614359172" keyTimes="0;0.2;0.4;0.6;1" dur="4.7" begin="-2.4440000000000004s" repeatCount="indefinite">
                                </animate>
                            </circle>
                            <circle cx="50" cy="50" fill="none" r="33" stroke="#bb4410" strokeWidth="6">
                                <animate attributeName="stroke-dasharray" calcMode="linear" values="0 0 0 103.67255756846318 0 103.67255756846318;0 0 103.67255756846318 0 0 103.67255756846318;0 0 103.67255756846318 0 0 103.67255756846318;0 103.67255756846318 0 103.67255756846318 0 103.67255756846318;0 103.67255756846318 0 103.67255756846318 0 103.67255756846318" keyTimes="0;0.2;0.4;0.6;1" dur="4.7" begin="-3.008s" repeatCount="indefinite">
                                </animate>
                            </circle>
                        </g>
                    </svg>
                );
        }
    }
}

export default Loader;
