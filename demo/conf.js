/**
 * Created by hn on 14-7-22.
 */

var configList = [

    // Separator
    {
        Separator: [ {}, {}, {}, {} ]
    },

    // History
    {
        LabelPanel: {
            label: '历史记录',
            break: true
        },
        Button: [ {
            className: 'bw-undo-btn'
        }, {
            className: 'bw-redo-btn'
        } ]
    },

    // Clipboard
    {
        LabelPanel: {
            label: '剪贴板'
        },
        Panel: [ {
            break: true
        }, {
            break: true
        } ],
        Button: [ {
            className: 'bw-copy-btn',
            label: '复制'
        }, {
            className: 'bw-cut-btn',
            label: '剪切'
        }, {
            className: 'bw-paste-btn',
            label: '粘贴',
            layout: 'bottom'
        } ]
    },

    // font
    {
        LabelPanel: {
            className: 'bw-font',
            label: '字体',
            break: true
        },
        Panel: [ {
            className: 'bw-font-top-panel'
        }, {
            className: 'bw-font-bottom-panel'
        } ],
        InputMenu: [ {
            className: 'bw-font-family',
            input: {
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
            className: 'bw-font-size',
            input: {
                button: {
                    className: 'bw-down-open-btn'
                }
            },
            menu: {
                items: [ 8, 9, 10, 12, 14, 16, 18, 20, 24, 26, 36, 48, 72 ]
            }
        } ],
        Button: [ {
            className: 'bw-removeformat-btn',
            label: '清除格式'
        }, {
            className: 'bw-autotypeset-btn',
            label: '自动格式化'
        }, {
            className: 'bw-formatmatch-btn',
            label: '格式刷'
        }, {
            className: 'bw-fontsize-plus-btn'
        }, {
            className: 'bw-fontsize-minus-btn'
        } ],
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
        Buttonset: {
            className: 'bw-script-btn-set',
            buttons: [ {
                className: 'bw-superscript-btn'
            }, {
                className: 'bw-subscript-btn'
            } ]
        },
        ColorPicker: [ {

        }, {

        } ]

    },

    // Paragraph
    {
        LabelPanel: {
            className: 'bw-paragraph',
            label: '字体',
            break: true
        },
        Panel: [ {
            className: "bw-paragraph-top-panel"
        }, {
            className: "bw-paragraph-bottom-panel"
        } ],
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
            className: 'bw-space-line-btn',
            text: '行距'
        }, {
            className: 'bw-space-paragraph-front-btn',
            text: '段前距'
        }, {
            className: 'bw-space-paragraph-back-btn',
            text: '段后距'
        } ],

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
        }

    }

];