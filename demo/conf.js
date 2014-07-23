/**
 * Created by hn on 14-7-22.
 */

var config = {
    clazz: 'Tabs',
    className: 'bw-tabs',
    buttons: [
        {
            className: 'bw-tabs-btn',
            label: "编辑"
        },
        {
            className: 'bw-tabs-btn',
            label: "页面布局"
        },
        {
            className: 'bw-tabs-btn',
            label: "审阅"
        },
        {
            className: 'bw-tabs-btn',
            label: "视图"
        }
    ],

    panels: [
        {

            widgets: [

                // history
                {
                    clazz: 'LabelPanel',
                    className: 'bw-history',
                    label: '历史记录',
                    break: true,
                    widgets: [
                        {
                            clazz: 'Button',
                            className: 'bw-undo-btn'
                        },
                        {
                            clazz: 'Button',
                            className: 'bw-redo-btn'
                        }
                    ]
                },

                {
                    clazz: 'Separator'
                },

                // Clipboard
                {
                    clazz: 'LabelPanel',
                    className: 'bw-clipboard',
                    label: '剪贴板',
                    widgets: [
                        {
                            clazz: 'Panel',
                            break: true,
                            widgets: [
                                {
                                    clazz: 'Button',
                                    className: 'bw-copy-btn',
                                    label: '复制'
                                },
                                {
                                    clazz: 'Button',
                                    className: 'bw-cut-btn',
                                    label: '剪切'
                                }
                            ]
                        },
                        {
                            clazz: 'Panel',
                            widgets: {
                                clazz: 'Button',
                                className: 'bw-paste-btn',
                                label: '粘贴',
                                layout: 'bottom'
                            }
                        }
                    ]

                },

                {
                    clazz: 'Separator'
                },

                // Font
                {
                    clazz: 'LabelPanel',
                    className: 'bw-font',
                    label: '字体',
                    break: true,
                    widgets: [
                        {
                            clazz: 'Panel',
                            className: 'bw-font-top-panel',
                            widgets: [
                                {
                                    clazz: 'InputMenu',
                                    className: 'bw-font-family',
                                    input: {
                                        placeholder: '字体',
                                        button: {
                                            className: 'bw-down-open-btn'
                                        }
                                    },
                                    menu: {
                                        items: [
                                            {
                                                className: 'bw-font-arial',
                                                label: 'Arial'
                                            },
                                            {
                                                className: 'bw-font-yahei',
                                                label: '微软雅黑'
                                            },
                                            {
                                                className: 'bw-font-kaiti',
                                                label: '楷体'
                                            },
                                            {
                                                className: 'bw-font-calibri-light',
                                                label: 'Calibri Light'
                                            },
                                            {
                                                className: 'bw-font-symbol',
                                                label: 'Symbol'
                                            },
                                            {
                                                className: 'bw-font-times',
                                                label: 'Times'
                                            },
                                            {
                                                className: 'bw-font-times-new-roman',
                                                label: 'Times New Roman'
                                            }
                                        ]
                                    }
                                },
                                {
                                    clazz: 'Button',
                                    className: 'bw-removeformat-btn',
                                    label: '清除格式'
                                },
                                {
                                    clazz: 'Button',
                                    className: 'bw-autotypeset-btn',
                                    label: '自动格式化'
                                },
                                {
                                    clazz: 'Button',
                                    className: 'bw-formatmatch-btn',
                                    label: '格式刷'
                                }
                            ]
                        },
                        {
                            clazz: 'Panel',
                            className: 'bw-font-bottom-panel',
                            widgets: [
                                {
                                    clazz: 'InputMenu',
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
                                {
                                    clazz: 'Button',
                                    className: 'bw-fontsize-plus-btn'
                                },
                                {
                                    clazz: 'Button',
                                    className: 'bw-fontsize-minus-btn'
                                },
                                {
                                    clazz: 'Buttonset',
                                    className: 'bw-script-btn-set',
                                    buttons: [
                                        {
                                            className: 'bw-superscript-btn'
                                        },
                                        {
                                            className: 'bw-subscript-btn'
                                        }
                                    ]
                                },
                                {
                                    clazz: 'ToggleButton',
                                    className: 'bw-bold-btn'
                                },
                                {
                                    clazz: 'ToggleButton',
                                    className: 'bw-italic-btn'
                                },
                                {
                                    clazz: 'ToggleButton',
                                    className: 'bw-underline-btn'
                                },
                                {
                                    clazz: 'ToggleButton',
                                    className: 'bw-strikethrough-btn'
                                },
                                {
                                    clazz: 'ToggleButton',
                                    className: 'bw-forecolor-btn'
                                },
                                {
                                    clazz: 'ToggleButton',
                                    className: 'bw-backcolor-btn'
                                },
                                {
                                    clazz: 'ColorPicker'
                                },
                                {
                                    clazz: 'ColorPicker'
                                }
                            ]
                        }
                    ]

                },

                {
                    clazz: 'Separator'
                },

                // Paragraph
                {
                    clazz: 'LabelPanel',
                    className: 'bw-paragraph',
                    label: '段落',
                    break: true,
                    widgets: {
                        clazz: 'Panel',
                        className: "bw-paragraph-top-panel",
                        widgets: [
                            {
                                clazz: 'ButtonMenu',
                                buttons: [
                                    {
                                        className: 'bw-paragraph-ul-btn'
                                    },
                                    {
                                        className: 'bw-down-open-btn'
                                    }
                                ],
                                menu: {
                                    items: [
                                        {
                                            className: 'bw-paragraph-ul-disc',
                                            label: '实心项目符号'
                                        },
                                        {
                                            className: 'bw-paragraph-ul-circle',
                                            label: '空心项目符号'
                                        },
                                        {
                                            className: 'bw-paragraph-ul-square',
                                            label: '方形项目符号'
                                        }
                                    ]
                                }
                            },
                            {
                                clazz: 'ButtonMenu',
                                buttons: [
                                    {
                                        className: 'bw-paragraph-ol-btn'
                                    },
                                    {
                                        className: 'bw-down-open-btn'
                                    }
                                ],
                                menu: {
                                    items: [
                                        {
                                            className: 'bw-paragraph-ol-decimal',
                                            label: '1., 2., 3., 4.,'
                                        },
                                        {
                                            className: 'bw-paragraph-ul-lower-alpha',
                                            label: 'a., b., c., d.,'
                                        },
                                        {
                                            className: 'bw-paragraph-ul-lower-roman',
                                            label: 'i., ii., iii., iv.,'
                                        },
                                        {
                                            className: 'bw-paragraph-ul-upper-alpha',
                                            label: 'A., B., C., D.,'
                                        },
                                        {
                                            className: 'bw-paragraph-ul-upper-roman',
                                            label: 'I., II., III., IV.,'
                                        }
                                    ]
                                }
                            },
                            {
                                clazz: 'Button',
                                className: 'bw-indent-left-btn',
                                text: '减少缩进量'
                            },
                            {
                                clazz: 'Button',
                                className: 'bw-indent-right-btn',
                                text: '增加缩进量'
                            },
                            {
                                clazz: 'Button',
                                className: 'bw-blockquote-btn',
                                text: '引用'
                            }
                        ]
                    }
                },
                {
                    clazz: 'Panel',
                    className: "bw-paragraph-bottom-panel",
                    widgets: [
                        {
                            clazz: 'Buttonset',
                            className: 'bw-justify',
                            buttons: [
                                {
                                    className: 'bw-justify-left-btn'
                                },
                                {
                                    className: 'bw-justify-right-btn'
                                },
                                {
                                    className: 'bw-justify-center-btn'
                                },
                                {
                                    className: 'bw-justify-full-btn'
                                }
                            ]
                        },

                        {
                            clazz: 'Button',
                            className: 'bw-space-line-btn',
                            text: '行距'
                        },
                        {
                            clazz: 'Button',
                            className: 'bw-space-paragraph-front-btn',
                            text: '段前距'
                        },
                        {
                            clazz: 'Button',
                            className: 'bw-space-paragraph-back-btn',
                            text: '段后距'
                        }
                    ]

                },
                {
                    clazz: 'Separator'
                }
            ]

        }

    ]
};
