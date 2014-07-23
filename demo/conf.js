/**
 * Created by hn on 14-7-22.
 */

var config = {
    className: 'bw-tabs',
    buttons: [ {
        className: 'bw-tabs-btn',
        label: "编辑"
    }, {
        className: 'bw-tabs-btn',
        label: "页面布局"
    }, {
        className: 'bw-tabs-btn',
        label: "审阅"
    }, {
        className: 'bw-tabs-btn',
        label: "视图"
    } ],

    panels: [ {

        widgets: [

            // history
            {
                name: 'LabelPanel',
                className: 'bw-history',
                label: '历史记录',
                break: true,
                widgets: [ {
                    name: 'Button',
                    className: 'bw-undo-btn'
                }, {
                    name: 'Button',
                    className: 'bw-redo-btn'
                } ]
            },

            {
                name: 'Separator'
            },

            // Clipboard
            {
                name: 'LabelPanel',
                className: 'bw-clipboard',
                label: '剪贴板',
                widgets: [ {
                        name: 'Panel',
                        break: true,
                        widgets: [ {
                            name: 'Button',
                            className: 'bw-copy-btn',
                            label: '复制'
                        }, {
                            name: 'Button',
                            className: 'bw-cut-btn',
                            label: '剪切'
                        } ]
                    }, {
                        name: 'Panel',
                        widgets: {
                            name: 'Button',
                            className: 'bw-paste-btn',
                            label: '粘贴',
                            layout: 'bottom'
                        }
                    } ]

            },

            {
                name: 'Separator'
            },

            // Font
            {
                name: 'LabelPanel',
                className: 'bw-font',
                label: '字体',
                break: true,
                widgets: [ {
                        name: 'Panel',
                        className: 'bw-font-top-panel',
                        widgets: [ {
                                name: 'InputMenu',
                                className: 'bw-font-family',
                                input: {
                                    placeholder: '字体',
                                    button: {
                                        className: 'bw-down-open-btn'
                                    }
                                },
                                menu: {
                                    items: [ {
                                        className: 'bw-font-arial',
                                        label: 'Arial'
                                    }, {
                                        className: 'bw-font-yahei',
                                        label: '微软雅黑'
                                    }, {
                                        className: 'bw-font-kaiti',
                                        label: '楷体'
                                    }, {
                                        className: 'bw-font-calibri-light',
                                        label: 'Calibri Light'
                                    }, {
                                        className: 'bw-font-symbol',
                                        label: 'Symbol'
                                    }, {
                                        className: 'bw-font-times',
                                        label: 'Times'
                                    }, {
                                        className: 'bw-font-times-new-roman',
                                        label: 'Times New Roman'
                                    } ]
                                }
                            }, {
                                namw: 'Button',
                                className: 'bw-removeformat-btn',
                                label: '清除格式'
                            }, {
                                namw: 'Button',
                                className: 'bw-autotypeset-btn',
                                label: '自动格式化'
                            }, {
                                namw: 'Button',
                                className: 'bw-formatmatch-btn',
                                label: '格式刷'
                            } ]
                        }
                    }, {
                        name: 'Panel',
                        className: 'bw-font-bottom-panel',
                        widgets: {
                            InputMenu: {
                                className: 'bw-font-size',
                                input: {
                                    placeholder: '字号',
                                    button: {
                                        className: 'bw-down-open-btn'
                                    }
                                },
                                menu: {
                                    items: [ 8, 9, 10, 12, 14, 16, 18, 20, 24, 26, 36, 48, 72 ]
                                }
                            },
                            Button: [ {
                                className: 'bw-fontsize-plus-btn'
                            }, {
                                className: 'bw-fontsize-minus-btn'
                            } ],
                            Buttonset: {
                                className: 'bw-script-btn-set',
                                buttons: [ {
                                    className: 'bw-superscript-btn'
                                }, {
                                    className: 'bw-subscript-btn'
                                } ]
                            },
                            ToggleButton: [ {
                                className: 'bw-bold-btn'
                            }, {
                                className: 'bw-italic-btn'
                            }, {
                                className: 'bw-underline-btn'
                            }, {
                                className: 'bw-strikethrough-btn'
                            }, {
                                className: 'bw-forecolor-btn'
                            }, {
                                className: 'bw-backcolor-btn'
                            } ],
                            ColorPicker: [ {

                            }, {

                            } ]
                        }
                    } ]

            },

            {
                name: 'Separator'
            },

            // Paragraph
            {
                name: 'LabelPanel',
                className: 'bw-paragraph',
                label: '段落',
                break: true,
                widgets: [ {
                    name: 'Panel',
                    className: "bw-paragraph-top-panel",
                    widgets: {
                        ButtonMenu: [ {
                            buttons: [ {
                                className: 'bw-paragraph-ul-btn'
                            }, {
                                className: 'bw-down-open-btn'
                            } ],
                            menu: {
                                items: [ {
                                    className: 'bw-paragraph-ul-disc',
                                    label: '实心项目符号'
                                }, {
                                    className: 'bw-paragraph-ul-circle',
                                    label: '空心项目符号'
                                }, {
                                    className: 'bw-paragraph-ul-square',
                                    label: '方形项目符号'
                                } ]
                            }
                        }, {
                            buttons: [ {
                                className: 'bw-paragraph-ol-btn'
                            }, {
                                className: 'bw-down-open-btn'
                            } ],
                            menu: {
                                items: [ {
                                    className: 'bw-paragraph-ol-decimal',
                                    label: '1., 2., 3., 4.,'
                                }, {
                                    className: 'bw-paragraph-ul-lower-alpha',
                                    label: 'a., b., c., d.,'
                                }, {
                                    className: 'bw-paragraph-ul-lower-roman',
                                    label: 'i., ii., iii., iv.,'
                                }, {
                                    className: 'bw-paragraph-ul-upper-alpha',
                                    label: 'A., B., C., D.,'
                                }, {
                                    className: 'bw-paragraph-ul-upper-roman',
                                    label: 'I., II., III., IV.,'
                                } ]
                            }
                        } ],

                        Button: [ {
                            className: 'bw-indent-left-btn',
                            text: '减少缩进量'
                        }, {
                            className: 'bw-indent-right-btn',
                            text: '增加缩进量'
                        }, {
                            className: 'bw-blockquote-btn',
                            text: '引用'
                        } ]
                    }
                }, {
                    name: 'Panel',
                    className: "bw-paragraph-bottom-panel",
                    widgets: {
                        Buttonset: {
                            className: 'bw-justify',
                            buttons: [ {
                                className: 'bw-justify-left-btn'
                            }, {
                                className: 'bw-justify-right-btn'
                            }, {
                                className: 'bw-justify-center-btn'
                            }, {
                                className: 'bw-justify-full-btn'
                            } ]
                        },

                        Button: [ {
                            className: 'bw-space-line-btn',
                            text: '行距'
                        }, {
                            className: 'bw-space-paragraph-front-btn',
                            text: '段前距'
                        }, {
                            className: 'bw-space-paragraph-back-btn',
                            text: '段后距'
                        } ]

                    }
                } ]
            },

            {
                name: 'Separator'
            }

        ]
    } ]

};
