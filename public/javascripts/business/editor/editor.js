$(document).ready(function() {
    var nowselection, nowrange, selection, range;
    document.getElementById('eblock_con').focus();
    nowselection = window.getSelection ? window.getSelection() : document.selection;
    nowrange = nowselection.createRange ? nowselection.createRange() : nowselection.getRangeAt(0);
    document.getElementById('eblock_con').onkeyup = document.getElementById('eblock_con').onmouseup = function(e) {
        document.getElementById('eblock_con').focus();
        nowselection = window.getSelection ? window.getSelection() : document.selection;
        nowrange = nowselection.createRange ? nowselection.createRange() : nowselection.getRangeAt(0);
    }
    var Manager = {
        insertHtml: function(html) {

            //判断浏览器是ie，但不是ie9以上
            var browser = checkBrowser().split(":");
            var IEbrowser = checkBrowser().split(":")[0];
            var IEverson = Number(checkBrowser().split(":")[1]);
            if (IEbrowser == "IE" && IEverson < 9) {
                range.pasteHTML(html);
            } else {
                var node = document.createElement('img');
                node.setAttribute("src", html);
                range.insertNode(node);
                selection.addRange(range);
            }
        },
    }

    function checkBrowser() {
        var browserName = navigator.userAgent.toLowerCase();
        var Sys = {};
        var rtn = false;
        if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
            strBrowser = "IE: " + browserName.match(/msie ([\d.]+)/)[1];
            rtn = true;
        } else if (/firefox/i.test(browserName)) {
            strBrowser = "Firefox: " + browserName.match(/firefox\/([\d.]+)/)[1];;
        } else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
            strBrowser = "Chrome: " + browserName.match(/chrome\/([\d.]+)/)[1];
        } else if (/opera/i.test(browserName)) {
            strBrowser = "Opera: " + browserName.match(/opera.([\d.]+)/)[1];
        } else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
            strBrowser = "Safari: ";
        } else {
            strBrowser = "unKnow,未知浏览器 ";
        }
        strBrowser = strBrowser;
        return strBrowser;
    }

    var load = function() {
        _lthis = this;
        _lthis.zindex = 2;
    };
    load.prototype = {
        _init: function() {
            _lthis._createload();
        },
        _createload: function() {
            $("body").append("<div class='loadmodal'><img src='../../../images/hc.gif'></div>");
            $(".loadmodal").css({
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'background-color': 'rgba(0,0,0,0.3)',
                'overflow': 'hidden',
                'text-align': 'center',
                'z-index': _lthis.zindex,
                'display': 'none',
            });
            $(".loadmodal img").css({
                'margin-top': '200px'
            });
        },
        _loadshow: function() {
            $(".loadmodal").show();
        },
        _loadhide: function() {
            $(".loadmodal").hide();
        }
    }

    // 总编辑类
    var edit = function() {
        _ethis = this;
        _ethis._editor = null;
        _ethis._pos = 0;
    };
    edit.prototype = {

        // 初始化
        _init: function() {
            _ethis._op();
            // _ethis._editinit();
        },

        // 实践操作
        _op: function() {

            // 弹出框
            $(".modalbtn").click(function() {
                selection = nowselection;
                range = nowrange;
                _ethis._showmodal($(this));
            });

            // 图片上传
            $(".add_pic_btn").click(function() {
                $(".addimage").click();
                $(".addimage").change(function() {
                    var file = $(".addimage")[0].files[0];
                    var fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                    var fileType = file.type;
                    $(".add_pic_btn").text(fileName);
                    if (fileType != "image/jpeg" && fileType != "image/png" && fileType != "image/jpg") {
                        alert("文件类型错误");
                    }
                });
            });

            $(".picmodal .cancel").click(function() {
                _ethis._picmodal_cancel();
            });
            $(".picmodal .sure").click(function() {
                _ethis._picmodal_sure();
            });

            $(".urlmodal .sure").click(function() {
                _ethis._urlmodal_sure();
            });
            $(".urlmodal .cancel").click(function() {
                _ethis._urlmodal_cancel();
            });
        },

        _showmodal: function(ele) {
            var type = ele.data('type');
            switch (type) {
                case 'picture':
                    _ethis._picmodal();
                    break;
                case 'link':
                    _ethis._urlmodal();
                    break;
                case 'save':
                    _ethis._saveall();
                default:
                    break;
            };
        },

        // 显示图片上传
        _picmodal: function() {
            $(".picmodal").show();
        },

        // 确定按钮
        _picmodal_sure: function() {
            var file = $(".addimage")[0].files[0];
            if (file == null) {
                alert("请添加文件");
            } else {
                var fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                var fileType = file.type;
                if (fileType != "image/jpeg" && fileType != "image/png" && fileType != "image/jpg") {
                    alert("文件类型错误");
                } else {
                    newload._loadshow();
                    _ethis._uploadimage();
                    _ethis._picmodal_cancel();
                }
            }
        },
        _uploadimage: function() {
            var this_imagefile = "addimage";
            $.ajaxFileUpload({
                url: '/editor/upload',
                fileElementId: this_imagefile,
                dataType: 'json',
                complete: function() {
                    newload._loadhide();
                },
                success: function(data, textStatus) {
                    if (data.error === "") {
                        var imageUrl = data.filePath;
                        var str = imageUrl;
                        Manager.insertHtml(str);
                    } else {
                        alert("上传错误!");
                    }
                },
                error: function(XMLHttpRequest, textStatus, error) {
                    console.log(error);
                }
            });
        },


        // 取消按钮
        _picmodal_cancel: function() {
            $(".picmodal").hide();
            $(".addimage").val();
            $(".add_pic_btn").text("添加");
        },


        // URL地址
        _urlmodal: function() {
            $(".urlmodal").show();
        },

        _urlmodal_sure: function() {
            var url = $(".modal_url").val();
            var title = $(".modal_urldec").val();
            var isok = false;
            if (url == "") {
                alert("请补全");
            } else {
                if (url.substring(0, 7) != "http://" && url.substring(0, 8) != "https://") {
                    url = "http://" + url;
                }
                var data = {
                    url: url
                };
                newload._loadshow();
                _ethis._urlmodal_cancel();
                $.ajax({
                    url: '', //放置接口地址
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    complete: function() {
                        newload._loadhide();
                    },
                    success: function(callback) {
                        var data = callback;
                        if (data.error) {
                            alert("添加不成功");
                        } else {
                            var str = data.filePath;
                            Manager.insertHtml(str);
                        }
                    }
                });
            }
        },

        // 关闭modal
        _urlmodal_cancel: function() {
            $(".modal_url").val('');
            $(".modal_urldec").val('');
            $(".urlmodal").hide();
        },

        // 保存所有
        _saveall: function() {
            var allContent = $(".eblock_con").html();
            allContent = allContent.replace(new RegExp('<div>', 'g'), '');
            allContent = allContent.replace(new RegExp('</div>', 'g'), '\r\n');
            allContent = allContent.replace(new RegExp('<br(.*?)>', 'g'), '');
            //allContent = allContent.replace(new RegExp('<br>', 'g'), '/r/n');
            //allContent = allContent.replace(new RegExp('<br/>', 'g'), '/r/n');

            alert(allContent);
            // alert("right");
        }
    };

    var newload = new load();
    var newedit = new edit();
    newload._init();
    newedit._init();
});